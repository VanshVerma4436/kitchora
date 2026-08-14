import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, 
    Text, Enum, Table, Index, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class RoleEnum(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    KITCHEN_OWNER = "KITCHEN_OWNER"
    ADMIN = "ADMIN"

class OrderStatusEnum(str, enum.Enum):
    PLACED = "PLACED"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class InventoryStatusEnum(str, enum.Enum):
    HEALTHY = "HEALTHY"
    LOW = "LOW"
    CRITICAL = "CRITICAL"

# --- 1. USERS & ACCESS ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    addresses = relationship("Address", back_populates="user")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    loyalty_account = relationship("LoyaltyAccount", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    search_history = relationship("SearchHistory", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    dietary_type = Column(String(50), default="ALL") # VEG, NON-VEG, VEGAN, GLUTEN-FREE
    favorite_cuisines = Column(JSON, default=list)
    max_spiciness = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="preferences")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    is_default = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="delivery_address")

# --- 2. KITCHENS ---
class Kitchen(Base):
    __tablename__ = "kitchens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)
    address = Column(String(255), nullable=False)
    cuisine_tags = Column(JSON, default=list)
    banner_image = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=4.5)
    total_ratings = Column(Integer, default=0)
    avg_prep_time_mins = Column(Integer, default=25)
    created_at = Column(DateTime, default=datetime.utcnow)

    menu_items = relationship("MenuItem", back_populates="kitchen")
    orders = relationship("Order", back_populates="kitchen")
    inventory_items = relationship("Inventory", back_populates="kitchen")
    reviews = relationship("Review", back_populates="kitchen")
    staff = relationship("KitchenStaff", back_populates="kitchen")
    demand_forecasts = relationship("DemandForecast", back_populates="kitchen")

class KitchenStaff(Base):
    __tablename__ = "kitchen_staff"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    staff_role = Column(String(50), default="CHEF")

    kitchen = relationship("Kitchen", back_populates="staff")

# --- 3. MENU & DISHES ---
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    icon = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)

    menu_items = relationship("MenuItem", back_populates="category")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_veg = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    is_bestseller = Column(Boolean, default=False)
    calories = Column(Integer, nullable=True)
    protein_g = Column(Float, default=0.0)
    carbs_g = Column(Float, default=0.0)
    fat_g = Column(Float, default=0.0)
    spice_level = Column(Integer, default=2) # 1-5
    prep_time_mins = Column(Integer, default=20)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("Kitchen", back_populates="menu_items")
    category = relationship("Category", back_populates="menu_items")
    customizations = relationship("MenuCustomization", back_populates="menu_item")
    order_items = relationship("OrderItem", back_populates="menu_item")

class MenuCustomization(Base):
    __tablename__ = "menu_customizations"

    id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    name = Column(String(100), nullable=False) # e.g. "Portion Size", "Extra Cheese", "Spice Level"
    option_name = Column(String(100), nullable=False) # e.g. "Large", "Double Cheese"
    additional_price = Column(Float, default=0.0)

    menu_item = relationship("MenuItem", back_populates="customizations")

# --- 4. INVENTORY ---
class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True)
    unit = Column(String(50), nullable=False) # kg, liters, units

    inventory_items = relationship("Inventory", back_populates="ingredient")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, default=0.0)
    min_threshold = Column(Float, default=5.0)
    status = Column(Enum(InventoryStatusEnum), default=InventoryStatusEnum.HEALTHY)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    kitchen = relationship("Kitchen", back_populates="inventory_items")
    ingredient = relationship("Ingredient", back_populates="inventory_items")
    transactions = relationship("InventoryTransaction", back_populates="inventory_item")

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)
    change_amount = Column(Float, nullable=False) # e.g. -2.5 for order usage, +10 for restock
    reason = Column(String(100), nullable=False) # ORDER_USAGE, RESTOCK, SPOILAGE
    created_at = Column(DateTime, default=datetime.utcnow)

    inventory_item = relationship("Inventory", back_populates="transactions")

# --- 5. ORDERS & CHECKOUT ---
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    delivery_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=True)
    
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    status = Column(Enum(OrderStatusEnum), default=OrderStatusEnum.PLACED, nullable=False, index=True)
    special_instructions = Column(Text, nullable=True)
    estimated_delivery_mins = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    kitchen = relationship("Kitchen", back_populates="orders")
    delivery_address = relationship("Address", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)
    delivery = relationship("Delivery", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", back_populates="order_items")
    customizations = relationship("OrderCustomization", back_populates="order_item", cascade="all, delete-orphan")

class OrderCustomization(Base):
    __tablename__ = "order_customizations"

    id = Column(Integer, primary_key=True, index=True)
    order_item_id = Column(Integer, ForeignKey("order_items.id"), nullable=False)
    name = Column(String(100), nullable=False)
    option_name = Column(String(100), nullable=False)
    price = Column(Float, default=0.0)

    order_item = relationship("OrderItem", back_populates="customizations")

# --- 6. PAYMENTS & DELIVERY ---
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    payment_method = Column(String(50), default="MOCK_CARD")
    status = Column(String(50), default="COMPLETED") # PENDING, COMPLETED, FAILED
    transaction_id = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="payment")

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    agent_name = Column(String(100), default="Kitchora Fleet Rider")
    agent_phone = Column(String(50), default="+91 9876543210")
    status = Column(String(50), default="ASSIGNED")
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    eta_mins = Column(Integer, default=25)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order = relationship("Order", back_populates="delivery")

# --- 7. MARKETING & LOYALTY ---
class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_percentage = Column(Float, default=0.0)
    flat_discount = Column(Float, default=0.0)
    min_order_value = Column(Float, default=0.0)
    max_discount_amount = Column(Float, default=100.0)
    is_active = Column(Boolean, default=True)
    valid_until = Column(DateTime, nullable=True)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    sentiment_tag = Column(String(50), default="POSITIVE") # POSITIVE, NEUTRAL, NEGATIVE
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    kitchen = relationship("Kitchen", back_populates="reviews")

class LoyaltyAccount(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    points_balance = Column(Integer, default=100)
    tier = Column(String(50), default="SILVER") # SILVER, GOLD, PLATINUM
    streak_count = Column(Integer, default=1)
    referral_code = Column(String(50), unique=True)

    user = relationship("User", back_populates="loyalty_account")
    transactions = relationship("LoyaltyTransaction", back_populates="loyalty_account")

class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(Integer, primary_key=True, index=True)
    loyalty_account_id = Column(Integer, ForeignKey("loyalty_accounts.id"), nullable=False)
    points_change = Column(Integer, nullable=False)
    reason = Column(String(100), nullable=False) # ORDER_EARN, REDEMPTION, REFERRAL
    created_at = Column(DateTime, default=datetime.utcnow)

    loyalty_account = relationship("LoyaltyAccount", back_populates="transactions")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

# --- 8. AI, SEARCH & ANALYTICS ---
class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    query = Column(String(255), nullable=False)
    parsed_intent = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="search_history")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_uuid = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    sender = Column(String(20), nullable=False) # "USER" or "AI"
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    menu_item_name = Column(String(255), nullable=False)
    predicted_demand_qty = Column(Integer, nullable=False)
    confidence_score = Column(Float, default=0.88)
    forecast_date = Column(String(50), nullable=False) # e.g. "2026-08-14"
    procurement_recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("Kitchen", back_populates="demand_forecasts")
