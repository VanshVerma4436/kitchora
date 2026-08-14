from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.schemas_db import Inventory, Ingredient, DemandForecast, Kitchen
from app.schemas.pydantic_schemas import InventoryItemResponse, DemandForecastResponse
from ai.demand_forecasting.forecaster import calculate_demand_forecast

router = APIRouter()

@router.get("/kitchen/{kitchen_id}", response_model=List[InventoryItemResponse])
def get_kitchen_inventory(kitchen_id: int, db: Session = Depends(get_db)):
    items = db.query(Inventory).filter(Inventory.kitchen_id == kitchen_id).all()
    res = []
    for item in items:
        ingredient = db.query(Ingredient).filter(Ingredient.id == item.ingredient_id).first()
        res.append({
            "id": item.id,
            "kitchen_id": item.kitchen_id,
            "ingredient_name": ingredient.name if ingredient else "Raw Ingredient",
            "unit": ingredient.unit if ingredient else "kg",
            "quantity": item.quantity,
            "min_threshold": item.min_threshold,
            "status": item.status,
            "last_updated": item.last_updated
        })
    return res

@router.get("/forecast/kitchen/{kitchen_id}", response_model=List[DemandForecastResponse])
def get_demand_forecast(kitchen_id: int, db: Session = Depends(get_db)):
    kitchen = db.query(Kitchen).filter(Kitchen.id == kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")
    
    # Calculate live demand forecast using AI forecasting engine
    dishes = [
        {"name": item.name, "is_bestseller": item.is_bestseller, "protein_g": item.protein_g}
        for item in kitchen.menu_items
    ]
    raw_forecasts = calculate_demand_forecast(kitchen_id, dishes)

    result = []
    for idx, f in enumerate(raw_forecasts):
        result.append({
            "id": idx + 1,
            "kitchen_id": f["kitchen_id"],
            "menu_item_name": f["menu_item_name"],
            "predicted_demand_qty": f["predicted_demand_qty"],
            "confidence_score": f["confidence_score"],
            "forecast_date": f["forecast_date"],
            "procurement_recommendation": f["procurement_recommendation"]
        })

    return result
