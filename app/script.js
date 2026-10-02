const reviewInput = document.getElementById("review");
const analyzeBtn = document.getElementById("analyzeBtn");
const charCount = document.getElementById("charCount");

const result = document.getElementById("result");
const errorBox = document.getElementById("error");

const sentiment = document.getElementById("sentiment");
const sentimentBadge = document.getElementById("sentimentBadge");
const confidence = document.getElementById("confidence");

const negativeProbability = document.getElementById("negativeProbability");
const positiveProbability = document.getElementById("positiveProbability");

const negativeBar = document.getElementById("negativeBar");
const positiveBar = document.getElementById("positiveBar");

reviewInput.addEventListener("input", () => {
    charCount.textContent = `${reviewInput.value.length} / 5000`;
});

analyzeBtn.addEventListener("click", analyzeSentiment);

async function analyzeSentiment() {
    const text = reviewInput.value.trim();

    if (!text) {
        showError("Please enter a review first.");
        return;
    }

    hideError();
    result.classList.add("hidden");

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        displayResult(data);

    } catch (error) {
        console.error(error);

        showError(
            "Could not connect to the sentiment API. Make sure FastAPI is running."
        );

    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Sentiment";
    }
}

function displayResult(data) {
    const sentimentValue = data.sentiment;

    sentiment.textContent = sentimentValue;
    confidence.textContent = `${(data.confidence * 100).toFixed(2)}%`;

    negativeProbability.textContent =
        `${(data.negative_probability * 100).toFixed(2)}%`;

    positiveProbability.textContent =
        `${(data.positive_probability * 100).toFixed(2)}%`;

    negativeBar.style.width =
        `${data.negative_probability * 100}%`;

    positiveBar.style.width =
        `${data.positive_probability * 100}%`;

    sentimentBadge.textContent = sentimentValue;
    sentimentBadge.className =
        sentimentValue.toLowerCase();

    sentiment.className =
        sentimentValue.toLowerCase();

    result.classList.remove("hidden");
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function hideError() {
    errorBox.classList.add("hidden");
}