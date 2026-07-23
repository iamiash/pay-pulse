from pydantic import BaseModel, Field
from typing import Optional

# Database Model Schema for User Wallet
class WalletSchema(BaseModel):
    id: int
    user_id: int
    balance: float = Field(gt=0, description="Wallet balance must be greater than zero")
    currency: str = "USD"

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "user_id": 101,
                "balance": 2500.50,
                "currency": "USD"
            }
        }

# Simulated Backend API Endpoint Logic
def get_user_wallet_balance(user_id: int):
    """
    Simulates fetching a type-safe user wallet from database.
    """
    # Mock database retrieval
    mock_wallet_db = {
        101: {"id": 1, "user_id": 101, "balance": 2500.50, "currency": "USD"}
    }
    
    wallet_data = mock_wallet_db.get(user_id)
    if wallet_data:
        return WalletSchema(**wallet_data)
    return {"error": "Wallet not found"}
