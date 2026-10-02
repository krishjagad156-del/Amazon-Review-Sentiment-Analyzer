from fastapi.testclient import TestClient

from src.api import app


client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "running"
    assert data["version"] == "1.0.0"


def test_health():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert "device" in data


def test_positive_review():
    response = client.post(
        "/predict",
        json={
            "text": (
                "This product is fantastic. "
                "The quality is excellent and I love it."
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["sentiment"] == "Positive"
    assert 0 <= data["confidence"] <= 1
    assert 0 <= data["negative_probability"] <= 1
    assert 0 <= data["positive_probability"] <= 1


def test_negative_review():
    response = client.post(
        "/predict",
        json={
            "text": (
                "This product is terrible. "
                "It broke after two days and I regret buying it."
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["sentiment"] == "Negative"
    assert 0 <= data["confidence"] <= 1
    assert 0 <= data["negative_probability"] <= 1
    assert 0 <= data["positive_probability"] <= 1


def test_empty_review():
    response = client.post(
        "/predict",
        json={"text": ""},
    )

    assert response.status_code == 422


def test_review_too_long():
    response = client.post(
        "/predict",
        json={"text": "a" * 5001},
    )

    assert response.status_code == 422