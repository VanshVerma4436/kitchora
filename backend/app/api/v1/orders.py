import uuid
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.schemas_db import (
    User, Order, OrderItem, OrderCustomization, MenuItem, Coupon, 
    Payment, Delivery, LoyaltyAccount, LoyaltyTransaction, OrderStatusEnum
)
from app.schemas.pydantic_schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.websocket.manager import manager
from ai.delivery_prediction.eta_engine import predict_delivery_eta

router = APIRouter()

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cart cannot be empty")

    subtotal = 0.0
    order_items_to_create = []

    for item_in in order_in.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_in.menu_item_id).first()
        if not menu_item or not menu_item.is_available:
            raise HTTPException(status_code=400, detail=f"Dish ID {item_in.menu_item_id} is unavailable")

        item_unit_price = menu_item.price
        custom_total = sum(c.price for c in item_in.customizations)
        item_total = (item_unit_price + custom_total) * item_in.quantity
        subtotal += item_total

        order_items_to_create.append({
            "menu_item": menu_item,
            "quantity": item_in.quantity,
            "unit_price": item_unit_price,
            "total_price": item_total,
            "customizations": item_in.customizations
        })

    # Discount Calculation
    discount_amount = 0.0
    if order_in.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == order_in.coupon_code,
            Coupon.is_active == True
        ).first()
        if coupon and subtotal >= coupon.min_order_value:
            if coupon.discount_percentage > 0:
                calc_discount = (subtotal * coupon.discount_percentage) / 100.0
                discount_amount = min(calc_discount, coupon.max_discount_amount)
            elif coupon.flat_discount > 0:
                discount_amount = min(coupon.flat_discount, subtotal)

    # Loyalty points redemption (10 points = ₹1)
    points_discount = 0.0
    if order_in.points_to_redeem and order_in.points_to_redeem > 0:
        loyalty = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == current_user.id).first()
        if loyalty and loyalty.points_balance >= order_in.points_to_redeem:
            points_discount = order_in.points_to_redeem / 10.0
            loyalty.points_balance -= order_in.points_to_redeem
            tx = LoyaltyTransaction(
                loyalty_account_id=loyalty.id,
                points_change=-order_in.points_to_redeem,
                reason="ORDER_REDEMPTION"
            )
            db.add(tx)

    total_discount = discount_amount + points_discount
    tax_amount = round(subtotal * 0.05, 2) # 5% GST
    delivery_fee = 30.0 if subtotal < 500 else 0.0
    total_amount = max(0.0, round(subtotal + tax_amount + delivery_fee - total_discount, 2))

    order_num = f"KITCH-{uuid.uuid4().hex[:8].upper()}"
    eta_mins = predict_delivery_eta(distance_km=3.2, active_kitchen_orders=4)

    db_order = Order(
        order_number=order_num,
        user_id=current_user.id,
        kitchen_id=order_in.kitchen_id,
        delivery_address_id=order_in.delivery_address_id,
        subtotal=subtotal,
        discount_amount=total_discount,
        tax_amount=tax_amount,
        delivery_fee=delivery_fee,
        total_amount=total_amount,
        status=OrderStatusEnum.PLACED,
        special_instructions=order_in.special_instructions,
        estimated_delivery_mins=eta_mins
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Save Items & Customizations
    for o_data in order_items_to_create:
        db_item = OrderItem(
            order_id=db_order.id,
            menu_item_id=o_data["menu_item"].id,
            quantity=o_data["quantity"],
            unit_price=o_data["unit_price"],
            total_price=o_data["total_price"]
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)

        for c_data in o_data["customizations"]:
            db_c = OrderCustomization(
                order_item_id=db_item.id,
                name=c_data.name,
                option_name=c_data.option_name,
                price=c_data.price
            )
            db.add(db_c)

    # Save Mock Payment
    payment = Payment(
        order_id=db_order.id,
        payment_method="MOCK_CARD_UPI",
        status="COMPLETED",
        transaction_id=f"TXN-{uuid.uuid4().hex[:10].upper()}",
        amount=total_amount
    )
    db.add(payment)

    # Save Delivery
    delivery = Delivery(
        order_id=db_order.id,
        agent_name="Vikram Singh (Kitchora Express)",
        agent_phone="+91 98765 43210",
        status="ASSIGNED",
        eta_mins=eta_mins
    )
    db.add(delivery)

    # Earn Loyalty Points (1 point per ₹10 spent)
    points_earned = int(total_amount // 10)
    if points_earned > 0:
        loyalty = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == current_user.id).first()
        if loyalty:
            loyalty.points_balance += points_earned
            tx = LoyaltyTransaction(
                loyalty_account_id=loyalty.id,
                points_change=points_earned,
                reason="ORDER_EARN"
            )
            db.add(tx)

    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("", response_model=List[OrderResponse])
def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_update.status
    db.commit()
    db.refresh(order)

    # Broadcast status change to connected WebSocket tracking clients
    await manager.broadcast_order_update(
        order_id=str(order.id),
        status=order.status.value,
        eta_mins=order.estimated_delivery_mins
    )

    return order
