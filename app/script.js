const API_URL = "https://amazon-review-sentiment-analyzer-31je.onrender.com/predict";
const reviewInput = document.getElementById("review");
const analyzeBtn = document.getElementById("analyzeBtn");
const charCount = document.getElementById("charCount");

const result = document.getElementById("result");
const sentiment = document.getElementById("sentiment");
const confidence = document.getElementById("confidence");
const sentimentBadge = document.getElementById("sentimentBadge");

const negativeProbability = document.getElementById("negativeProbability");
const positiveProbability = document.getElementById("positiveProbability");

const negativeBar = document.getElementById("negativeBar");
const positiveBar = document.getElementById("positiveBar");

const errorMessage = document.getElementById("error");


// Character counter
reviewInput.addEventListener("input", () => {
    charCount.textContent = `${reviewInput.value.length} / 5000`;
});


// Analyze sentiment
analyzeBtn.addEventListener("click", async () => {

    const text = reviewInput.value.trim();

    // Clear previous error
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    // Validate input
    if (!text) {
        errorMessage.textContent = "Please enter a review first.";
        errorMessage.classList.remove("hidden");
        result.classList.add("hidden");
        return;
    }

    // Loading state
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    result.classList.add("hidden");

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail?.[0]?.msg || "Something went wrong."
            );
        }

        // Convert probabilities to percentages
        const confidencePercent = data.confidence * 100;
        const negativePercent = data.negative_probability * 100;
        const positivePercent = data.positive_probability * 100;


        // Display sentiment
        sentiment.textContent = data.sentiment;

        confidence.textContent = `${confidencePercent.toFixed(2)}%`;

        negativeProbability.textContent =
            `${negativePercent.toFixed(2)}%`;

        positiveProbability.textContent =
            `${positivePercent.toFixed(2)}%`;


        // Update progress bars
        negativeBar.style.width = `${negativePercent}%`;
        positiveBar.style.width = `${positivePercent}%`;


        // Sentiment badge
        sentimentBadge.textContent = data.sentiment;

        sentimentBadge.className = "";

        if (data.sentiment.toLowerCase() === "positive") {
            sentimentBadge.classList.add("positive");
        } else {
            sentimentBadge.classList.add("negative");
        }


        // Show result
        result.classList.remove("hidden");

    } catch (error) {

    console.error("API Error:", error);

    errorMessage.textContent =
        `Error: ${error.message}`;

    errorMessage.classList.remove("hidden");



    } finally {

        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Sentiment";

    }
});