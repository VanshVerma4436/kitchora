from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.schemas_db import User, LoyaltyAccount
from app.schemas.pydantic_schemas import LoyaltyOverviewResponse

router = APIRouter()

@router.get("", response_model=LoyaltyOverviewResponse)
def get_user_loyalty(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    loyalty = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == current_user.id).first()
    if not loyalty:
        ref_code = f"KITCHORA{current_user.id:04d}"
        loyalty = LoyaltyAccount(user_id=current_user.id, points_balance=100, referral_code=ref_code)
        db.add(loyalty)
        db.commit()
        db.refresh(loyalty)

    value_inr = round(loyalty.points_balance / 10.0, 2)
    return {
        "points_balance": loyalty.points_balance,
        "tier": loyalty.tier,
        "streak_count": loyalty.streak_count,
        "referral_code": loyalty.referral_code,
        "value_in_inr": value_inr
    }
