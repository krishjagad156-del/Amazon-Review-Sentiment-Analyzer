# Amazon Review Sentiment Analyzer

A production-oriented sentiment analysis system for Amazon product reviews using a fine-tuned BERT model, FastAPI, Docker, and a web-based frontend.

The system classifies an Amazon review as **Positive** or **Negative** and returns the predicted sentiment together with confidence and class probabilities.

---

## 🚀 Features

- Fine-tuned BERT sentiment classification model
- Binary sentiment classification:
  - Positive
  - Negative
- Confidence score and class probabilities
- FastAPI REST API
- Interactive API documentation with Swagger UI
- Browser-based frontend
- Dockerized production API
- CPU-compatible Docker deployment
- Automated API tests with pytest
- Health-check endpoint
- Input validation
- CORS support

---

## 🧠 Model

The project uses a fine-tuned BERT-based sequence classification model trained for Amazon product review sentiment analysis.

### Output

For every review, the API returns:

```json
{
  "sentiment": "Positive",
  "confidence": 0.9967,
  "negative_probability": 0.0033,
  "positive_probability": 0.9967
}