from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ai_natural_language_search():
    res = client.post("/api/v1/ai/search", json={
        "prompt": "Show me high-protein vegetarian meals under ₹350"
    })
    assert res.status_code == 200
    data = res.json()
    assert "parsed_intent" in data
    assert data["parsed_intent"]["diet"] == "VEG"
    assert data["parsed_intent"]["max_price"] == 350.0

def test_ai_chatbot_fallback():
    res = client.post("/api/v1/ai/chat", json={
        "message": "What is the best biryani available today?"
    })
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert len(data["reply"]) > 10
