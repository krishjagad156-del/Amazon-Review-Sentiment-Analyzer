from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from src.inference import predict_sentiment, DEVICE


app = FastAPI(
    title="Amazon Review Sentiment Analyzer",
    description="BERT-based sentiment analysis API for Amazon product reviews.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Amazon product review text",
    )


class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    negative_probability: float
    positive_probability: float


@app.get("/")
def root():
    return {
        "message": "Amazon Review Sentiment Analyzer API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True,
        "device": str(DEVICE),
    }


@app.post("/predict", response_model=SentimentResponse)
def predict(request: ReviewRequest):
    text = request.text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Review cannot be empty.",
        )

    try:
        return predict_sentiment(text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )