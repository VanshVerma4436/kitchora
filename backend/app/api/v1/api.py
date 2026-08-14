from fastapi import APIRouter
from app.api.v1 import health, auth, kitchens, menu, orders, ai, inventory, loyalty, reviews, admin

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health Probe"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(kitchens.router, prefix="/kitchens", tags=["Cloud Kitchens"])
api_router.include_router(menu.router, prefix="/menu", tags=["Menu & Dishes"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders & Live Tracking"])
api_router.include_router(ai.router, prefix="/ai", tags=["Kitchora AI & Search"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Kitchen Inventory & Forecast"])
api_router.include_router(loyalty.router, prefix="/loyalty", tags=["Kitchora Rewards"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews & Sentiment"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Analytics"])
