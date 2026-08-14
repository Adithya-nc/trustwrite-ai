from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model_version" in data
    assert "reliability_notice" in data

def test_analyze_endpoint_success():
    sample_essay = """I have always been fascinated by the way computers solve problems. Growing up, I spent hours tinkering with broken electronics in my garage, trying to understand why they worked the way they did. My curiosity eventually led me to write my first program at age fourteen—a simple calculator that could add, subtract, multiply, and divide. During my second semester, I built a small web application to help my school track library book loans. It was clunky at first—full of bugs I didn't understand—but fixing each one felt like solving a puzzle."""
    
    headers = {"Authorization": "Bearer mock-jwt-token-u1"}
    response = client.post("/api/analyze", json={"essay": sample_essay}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "essayId" in data
    assert "authenticityScore" in data
    assert "aiProbability" in data
    assert "classification" in data
    assert "sentences" in data
    assert "metrics" in data
    assert "fingerprint" in data

def test_analyze_endpoint_empty_text():
    headers = {"Authorization": "Bearer mock-jwt-token-u1"}
    response = client.post("/api/analyze", json={"essay": ""}, headers=headers)
    assert response.status_code == 422

def test_get_essay_not_found():
    response = client.get("/api/essays/non_existent_id")
    assert response.status_code == 404
