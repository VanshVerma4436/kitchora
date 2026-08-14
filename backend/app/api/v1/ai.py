import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.schemas_db import MenuItem, SearchHistory, ChatSession, ChatMessage
from app.schemas.pydantic_schemas import AISearchRequest, AISearchResponse, AIChatRequest, AIChatResponse, MenuItemResponse
from app.services.ai_service import parse_natural_language_query, get_ai_chat_response
from ai.recommendation.recommender import score_menu_items

router = APIRouter()

@router.post("/search", response_model=AISearchResponse)
async def ai_natural_search(req: AISearchRequest, db: Session = Depends(get_db)):
    intent = await parse_natural_language_query(req.prompt)

    # Record search history
    sh = SearchHistory(query=req.prompt, parsed_intent=intent)
    db.add(sh)
    db.commit()

    # Query items matching intent
    q = db.query(MenuItem).filter(MenuItem.is_available == True)

    if intent.get("diet") == "VEG":
        q = q.filter(MenuItem.is_veg == True)
    elif intent.get("diet") == "NON-VEG":
        q = q.filter(MenuItem.is_veg == False)

    if intent.get("max_price"):
        q = q.filter(MenuItem.price <= intent["max_price"])

    items = q.all()
    
    # Dict representation for recommender scoring
    items_dict = [
        {
            "id": i.id, "kitchen_id": i.kitchen_id, "category_id": i.category_id,
            "name": i.name, "description": i.description, "price": i.price,
            "image_url": i.image_url, "is_veg": i.is_veg, "is_available": i.is_available,
            "is_bestseller": i.is_bestseller, "calories": i.calories, "protein_g": i.protein_g,
            "carbs_g": i.carbs_g, "fat_g": i.fat_g, "spice_level": i.spice_level,
            "prep_time_mins": i.prep_time_mins, "customizations": []
        }
        for i in items
    ]

    scored = score_menu_items(items_dict, user_diet=intent.get("diet", "ALL"), max_price=intent.get("max_price"))
    
    # Return formatted response
    matched_ids = [s["id"] for s in scored[:10]]
    final_items = [i for i in items if i.id in matched_ids]

    return {
        "query_text": req.prompt,
        "parsed_intent": intent,
        "items": final_items,
        "ai_used": True
    }

@router.post("/chat", response_model=AIChatResponse)
async def ai_chatbot(req: AIChatRequest, db: Session = Depends(get_db)):
    session_uuid = req.session_uuid or f"CHAT-{uuid.uuid4().hex[:8].upper()}"

    # Get sample menu items for context
    db_dishes = db.query(MenuItem).filter(MenuItem.is_available == True).limit(20).all()
    dishes_dict = [
        {"id": d.id, "name": d.name, "price": d.price, "is_veg": d.is_veg, "protein_g": d.protein_g, "is_bestseller": d.is_bestseller}
        for d in db_dishes
    ]

    chat_res = await get_ai_chat_response(req.message, dishes_dict)

    suggested = []
    if chat_res.get("suggested_dishes"):
        s_ids = [d["id"] for d in chat_res["suggested_dishes"]]
        suggested = db.query(MenuItem).filter(MenuItem.id.in_(s_ids)).all()

    return {
        "session_uuid": session_uuid,
        "reply": chat_res["reply"],
        "suggested_dishes": suggested,
        "ai_used": chat_res.get("ai_used", False)
    }
