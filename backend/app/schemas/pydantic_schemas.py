from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.schemas_db import RoleEnum, OrderStatusEnum, InventoryStatusEnum

# Token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: RoleEnum
    user_id: int
    full_name: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[RoleEnum] = None

# User
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: RoleEnum = RoleEnum.CUSTOMER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    role: RoleEnum
    is_active: bool
    created_at: datetime

# User Preference
class UserPreferenceUpdate(BaseModel):
    dietary_type: Optional[str] = "ALL"
    favorite_cuisines: Optional[List[str]] = []
    max_spiciness: Optional[int] = 5

class UserPreferenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    dietary_type: str
    favorite_cuisines: List[str]
    max_spiciness: int

# Category & Menu
class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon: Optional[str]
    display_order: int

class MenuCustomizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    option_name: str
    additional_price: float

class MenuItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    kitchen_id: int
    category_id: int
    name: str
    description: Optional[str]
    price: float
    image_url: Optional[str]
    is_veg: bool
    is_available: bool
    is_bestseller: bool
    calories: Optional[int]
    protein_g: float
    carbs_g: float
    fat_g: float
    spice_level: int
    prep_time_mins: int
    customizations: List[MenuCustomizationResponse] = []

# Kitchen
class KitchenResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str]
    address: str
    cuisine_tags: List[str]
    banner_image: Optional[str]
    is_active: bool
    rating: float
    total_ratings: int
    avg_prep_time_mins: int

class KitchenDetailResponse(KitchenResponse):
    menu_items: List[MenuItemResponse] = []

# Customization Selection in Order
class CustomizationSelection(BaseModel):
    name: str
    option_name: str
    price: float

# Order Items in Request
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(gt=0)
    customizations: List[CustomizationSelection] = []

# Create Order Request
class OrderCreate(BaseModel):
    kitchen_id: int
    delivery_address_id: Optional[int] = None
    items: List[OrderItemCreate]
    coupon_code: Optional[str] = None
    points_to_redeem: Optional[int] = 0
    special_instructions: Optional[str] = None

# Order Response
class OrderCustomizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    option_name: str
    price: float

class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    total_price: float
    menu_item: MenuItemResponse
    customizations: List[OrderCustomizationResponse] = []

class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    payment_method: str
    status: str
    transaction_id: str
    amount: float

class DeliveryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    agent_name: str
    agent_phone: str
    status: str
    eta_mins: int

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    user_id: int
    kitchen_id: int
    subtotal: float
    discount_amount: float
    tax_amount: float
    delivery_fee: float
    total_amount: float
    status: OrderStatusEnum
    special_instructions: Optional[str]
    estimated_delivery_mins: int
    created_at: datetime
    kitchen: KitchenResponse
    items: List[OrderItemResponse] = []
    payment: Optional[PaymentResponse] = None
    delivery: Optional[DeliveryResponse] = None

class OrderStatusUpdate(BaseModel):
    status: OrderStatusEnum

# AI Natural Search
class AISearchRequest(BaseModel):
    prompt: str

class AISearchResponse(BaseModel):
    query_text: str
    parsed_intent: Dict[str, Any]
    items: List[MenuItemResponse]
    ai_used: bool

# AI Chat
class AIChatRequest(BaseModel):
    message: str
    session_uuid: Optional[str] = None

class AIChatResponse(BaseModel):
    session_uuid: str
    reply: str
    suggested_dishes: List[MenuItemResponse] = []
    ai_used: bool

# Inventory
class InventoryItemResponse(BaseModel):
    id: int
    kitchen_id: int
    ingredient_name: str
    unit: str
    quantity: float
    min_threshold: float
    status: InventoryStatusEnum
    last_updated: datetime

# Demand Forecast
class DemandForecastResponse(BaseModel):
    id: int
    kitchen_id: int
    menu_item_name: str
    predicted_demand_qty: int
    confidence_score: float
    forecast_date: str
    procurement_recommendation: str

# Loyalty
class LoyaltyOverviewResponse(BaseModel):
    points_balance: int
    tier: str
    streak_count: int
    referral_code: str
    value_in_inr: float

# Review Create
class ReviewCreate(BaseModel):
    kitchen_id: int
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_name: str
    rating: int
    comment: Optional[str]
    sentiment_tag: str
    created_at: datetime

# Admin Analytics
class AdminAnalyticsResponse(BaseModel):
    total_users: int
    active_kitchens: int
    total_orders: int
    total_revenue: float
    avg_order_value: float
    cancellation_rate_pct: float
    delivery_success_pct: float
    recent_orders: List[OrderResponse] = []
