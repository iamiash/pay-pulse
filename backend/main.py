from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="PayPulse API", version="1.0.0")

# Enable CORS for Vite local dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data Models
class Subscription(BaseModel):
    id: int
    name: str
    category: str
    cost: float
    billing_cycle: str
    status: str

class DashboardSummary(BaseModel):
    wallet_balance: float
    monthly_spend: float
    active_subscriptions: int
    subscriptions: List[Subscription]

@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "message": "PayPulse FastAPI backend is active"}

@app.get("/api/v1/dashboard", response_model=DashboardSummary)
def get_dashboard_data():
    return {
        "wallet_balance": 2450.80,
        "monthly_spend": 128.45,
        "active_subscriptions": 4,
        "subscriptions": [
            {"id": 1, "name": "GitHub Copilot", "category": "Developer Tools", "cost": 10.00, "billing_cycle": "Monthly", "status": "Active"},
            {"id": 2, "name": "AWS Hosting", "category": "Cloud Infrastructure", "cost": 45.50, "billing_cycle": "Monthly", "status": "Active"},
            {"id": 3, "name": "Spotify Premium", "category": "Entertainment", "cost": 10.99, "billing_cycle": "Monthly", "status": "Active"},
            {"id": 4, "name": "Figma Pro", "category": "Design Tools", "cost": 15.00, "billing_cycle": "Monthly", "status": "Active"},
            {"id": 5, "name": "Netflix 4K", "category": "Entertainment", "cost": 19.99, "billing_cycle": "Monthly", "status": "Paused"},
        ]
    }