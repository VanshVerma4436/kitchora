from app.core.database import Base
from app.models.schemas_db import (
    User, UserPreference, Address, Kitchen, KitchenStaff,
    Category, MenuItem, MenuCustomization, Ingredient, Inventory, InventoryTransaction,
    Order, OrderItem, OrderCustomization, Payment, Delivery,
    Coupon, Review, LoyaltyAccount, LoyaltyTransaction, Notification,
    SearchHistory, ChatSession, ChatMessage, DemandForecast
)
