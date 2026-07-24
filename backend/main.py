import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="PayPulse API Engine", version="2.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_NAME = "paypulse.db"

# Database Initialization
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            cost REAL NOT NULL,
            billing_cycle TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Active'
        )
    """)
    cursor.execute("SELECT COUNT(*) FROM subscriptions")
    if cursor.fetchone()[0] == 0:
        sample_subs = [
            ("GitHub Copilot", "Developer Tools", 10.00, "Monthly", "Active"),
            ("AWS Hosting", "Cloud Infrastructure", 45.50, "Monthly", "Active"),
            ("Spotify Premium", "Entertainment", 10.99, "Monthly", "Active"),
            ("Figma Pro", "Design Tools", 15.00, "Monthly", "Active"),
            ("Netflix 4K", "Entertainment", 19.99, "Monthly", "Paused")
        ]
        cursor.executemany("""
            INSERT INTO subscriptions (name, category, cost, billing_cycle, status)
            VALUES (?, ?, ?, ?, ?)
        """, sample_subs)
    conn.commit()
    conn.close()

init_db()

class SubscriptionCreate(BaseModel):
    name: str
    category: str
    cost: float
    billing_cycle: str

@app.get("/api/v1/dashboard")
def get_dashboard_data():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, category, cost, billing_cycle, status FROM subscriptions")
    rows = cursor.fetchall()
    conn.close()

    subs = [
        {"id": r[0], "name": r[1], "category": r[2], "cost": r[3], "billing_cycle": r[4], "status": r[5]}
        for r in rows
    ]

    active_subs = [s for s in subs if s["status"] == "Active"]
    monthly_spend = sum(s["cost"] for s in active_subs)
    wallet_balance = 2500.00 - monthly_spend

    return {
        "wallet_balance": wallet_balance,
        "monthly_spend": monthly_spend,
        "active_subscriptions": len(active_subs),
        "subscriptions": subs
    }

@app.post("/api/v1/subscriptions")
def create_subscription(sub: SubscriptionCreate):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO subscriptions (name, category, cost, billing_cycle, status)
        VALUES (?, ?, ?, ?, 'Active')
    """, (sub.name, sub.category, sub.cost, sub.billing_cycle))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "message": "Subscription added successfully"}

@app.patch("/api/v1/subscriptions/{sub_id}/toggle")
def toggle_subscription_status(sub_id: int):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT status FROM subscriptions WHERE id = ?", (sub_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    new_status = "Paused" if row[0] == "Active" else "Active"
    cursor.execute("UPDATE subscriptions SET status = ? WHERE id = ?", (new_status, sub_id))
    conn.commit()
    conn.close()
    return {"message": f"Status updated to {new_status}"}

@app.delete("/api/v1/subscriptions/{sub_id}")
def delete_subscription(sub_id: int):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM subscriptions WHERE id = ?", (sub_id,))
    conn.commit()
    conn.close()
    return {"message": "Subscription deleted"}