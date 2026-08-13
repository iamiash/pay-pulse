from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    subscriptions,
    wallet,
    notifications,
    reports,
    admin,
)

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

api_router.include_router(
    subscriptions.router,
    prefix="/subscriptions",
    tags=["Subscriptions"]
)

api_router.include_router(
    wallet.router,
    prefix="/wallet",
    tags=["Wallet"]
)

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"]
)

api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"]
)

# Administrative API
api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)