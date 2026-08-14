from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.schemas_db import User, Kitchen, Order, OrderStatusEnum
from app.schemas.pydantic_schemas import AdminAnalyticsResponse

router = APIRouter()

@router.get("/analytics", response_model=AdminAnalyticsResponse)
def get_admin_analytics(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    active_kitchens = db.query(Kitchen).filter(Kitchen.is_active == True).count()
    orders = db.query(Order).all()
    total_orders = len(orders)
    
    total_revenue = sum(o.total_amount for o in orders)
    avg_order_value = round(total_revenue / total_orders, 2) if total_orders > 0 else 0.0

    cancelled_count = sum(1 for o in orders if o.status == OrderStatusEnum.CANCELLED)
    cancellation_rate = round((cancelled_count / total_orders) * 100.0, 1) if total_orders > 0 else 0.0

    delivered_count = sum(1 for o in orders if o.status == OrderStatusEnum.DELIVERED)
    delivery_success = round((delivered_count / (total_orders - cancelled_count + 0.001)) * 100.0, 1) if total_orders > 0 else 100.0

    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()

    return {
        "total_users": total_users,
        "active_kitchens": active_kitchens,
        "total_orders": total_orders,
        "total_revenue": round(total_revenue, 2),
        "avg_order_value": avg_order_value,
        "cancellation_rate_pct": cancellation_rate,
        "delivery_success_pct": min(delivery_success, 100.0),
        "recent_orders": recent_orders
    }
