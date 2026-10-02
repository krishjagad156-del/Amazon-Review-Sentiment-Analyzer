from pathlib import Path

import torch
import torch.nn.functional as F
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
)


PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "amazon-sentiment-bert"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


tokenizer = AutoTokenizer.from_pretrained(
    str(MODEL_PATH)
)

model = AutoModelForSequenceClassification.from_pretrained(
    str(MODEL_PATH)
)

model.to(DEVICE)
model.eval()


LABELS = {
    0: "Negative",
    1: "Positive",
}


def predict_sentiment(text: str) -> dict:
    """
    Predict sentiment for a single Amazon review.
    """

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=192,
    )

    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = F.softmax(outputs.logits, dim=-1)[0]

    predicted_class = torch.argmax(probabilities).item()

    return {
        "sentiment": LABELS[predicted_class],
        "confidence": float(probabilities[predicted_class]),
        "negative_probability": float(probabilities[0]),
        "positive_probability": float(probabilities[1]),
    }