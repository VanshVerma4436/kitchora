import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_register_and_login():
    unique_id = uuid.uuid4().hex[:6]
    email = f"testuser_{unique_id}@kitchora.com"
    # Register
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "password123",
        "full_name": "Pytest User",
        "phone": "+91 99999 88888",
        "role": "CUSTOMER"
    })
    assert reg_res.status_code == 201
    assert reg_res.json()["email"] == email

    # Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "password123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    # Get Me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["full_name"] == "Pytest User"
