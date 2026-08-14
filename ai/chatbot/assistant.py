from typing import List, Dict, Any

def generate_chatbot_fallback_reply(message: str, db_dishes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Contextual fallback responder when LLM API is unavailable.
    Provides intelligent answer based on available menu data.
    """
    msg_lower = message.lower()
    matching_dishes = []
    
    if any(k in msg_lower for k in ["recommend", "suggest", "popular", "best", "craving", "what to eat"]):
        matching_dishes = [d for d in db_dishes if d.get("is_bestseller")]
        reply = (
            "Here are Kitchora's top chef-recommended bestsellers today! "
            "Freshly prepared in our hygienic cloud kitchens with premium ingredients."
        )
    elif "protein" in msg_lower or "fitness" in msg_lower:
        matching_dishes = sorted(db_dishes, key=lambda x: x.get("protein_g", 0), reverse=True)[:4]
        reply = (
            "Looking for high-protein meals? Check out these nutrient-dense options "
            "packed with protein for your workout & recovery needs!"
        )
    elif "veg" in msg_lower or "vegetarian" in msg_lower:
        matching_dishes = [d for d in db_dishes if d.get("is_veg")][:4]
        reply = "Here are our most popular 100% vegetarian delicacies prepared with organic ingredients!"
    elif "coupon" in msg_lower or "discount" in msg_lower or "offer" in msg_lower:
        reply = (
            "🎉 You can use coupon code **KITCHORA20** at checkout for 20% OFF (up to ₹100)! "
            "Plus, earn 1 Kitchora Reward Point for every ₹10 spent."
        )
    elif "delivery" in msg_lower or "tracking" in msg_lower or "status" in msg_lower:
        reply = (
            "All Kitchora orders come with real-time GPS & preparation tracking via WebSockets. "
            "Average delivery time is 25-30 minutes!"
        )
    else:
        # Default top picks
        matching_dishes = db_dishes[:3]
        reply = (
            f"Kitchora AI is here to help! Here are a few top picks from our menu today. "
            f"Feel free to search for specific diets, high-protein options, or pricing limits."
        )

    return {
        "reply": reply,
        "suggested_dishes": matching_dishes[:4],
        "ai_used": False
    }
