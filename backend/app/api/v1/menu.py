from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.schemas_db import MenuItem, Category
from app.schemas.pydantic_schemas import MenuItemResponse, CategoryResponse

router = APIRouter()

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.display_order.asc()).all()

@router.get("", response_model=List[MenuItemResponse])
@router.get("/items", response_model=List[MenuItemResponse])
def get_menu_items(
    kitchen_id: Optional[int] = None,
    category_id: Optional[int] = None,
    is_veg: Optional[bool] = None,
    max_price: Optional[float] = None,
    bestsellers_only: Optional[bool] = None,
    query: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(MenuItem).filter(MenuItem.is_available == True)
    if kitchen_id:
        q = q.filter(MenuItem.kitchen_id == kitchen_id)
    if category_id:
        q = q.filter(MenuItem.category_id == category_id)
    if is_veg is not None:
        q = q.filter(MenuItem.is_veg == is_veg)
    if max_price is not None:
        q = q.filter(MenuItem.price <= max_price)
    if bestsellers_only:
        q = q.filter(MenuItem.is_bestseller == True)
    if query:
        q = q.filter(MenuItem.name.ilike(f"%{query}%"))
    
    return q.all()

@router.get("/{menu_item_id}", response_model=MenuItemResponse)
def get_menu_item_by_id(menu_item_id: int, db: Session = Depends(get_db)):
    item = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item
