from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.schemas_db import Kitchen, MenuItem
from app.schemas.pydantic_schemas import KitchenResponse, KitchenDetailResponse

router = APIRouter()

@router.get("", response_model=List[KitchenResponse])
def get_kitchens(
    query: Optional[str] = None,
    cuisine: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Kitchen).filter(Kitchen.is_active == True)
    if query:
        q = q.filter(Kitchen.name.ilike(f"%{query}%"))
    kitchens = q.all()

    if cuisine:
        kitchens = [k for k in kitchens if k.cuisine_tags and cuisine.lower() in [c.lower() for c in k.cuisine_tags]]

    return kitchens

@router.get("/{kitchen_id}", response_model=KitchenDetailResponse)
def get_kitchen_detail(kitchen_id: int, db: Session = Depends(get_db)):
    kitchen = db.query(Kitchen).filter(Kitchen.id == kitchen_id, Kitchen.is_active == True).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")
    return kitchen
