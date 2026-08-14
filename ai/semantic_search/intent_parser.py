import re
from typing import Dict, Any

def parse_search_intent_fallback(query: str) -> Dict[str, Any]:
    """
    Deterministic rule-based intent parser if external LLM API is unavailable.
    """
    q_lower = query.lower()
    intent = {
        "diet": "ALL",
        "max_price": None,
        "min_protein": None,
        "max_calories": None,
        "is_spicy": None,
        "keywords": []
    }

    # Diet matching
    if any(k in q_lower for k in ["veg", "vegetarian", "pure veg"]):
        intent["diet"] = "VEG"
    elif any(k in q_lower for k in ["non-veg", "chicken", "mutton", "fish", "egg"]):
        intent["diet"] = "NON-VEG"
    elif "vegan" in q_lower:
        intent["diet"] = "VEGAN"

    # Price extraction (e.g. under 250, below 300, < 200, under ₹250)
    price_match = re.search(r'(?:under|below|less than|<|rs|₹|\b)\s*(\d{2,4})', q_lower)
    if price_match:
        try:
            val = float(price_match.group(1))
            if 50 <= val <= 2000:
                intent["max_price"] = val
        except ValueError:
            pass

    # Protein requirement
    if any(k in q_lower for k in ["high protein", "protein rich", "fitness", "gym"]):
        intent["min_protein"] = 15.0

    # Low calorie
    if any(k in q_lower for k in ["low calorie", "healthy", "diet", "light"]):
        intent["max_calories"] = 500

    # Spicy
    if "spicy" in q_lower:
        intent["is_spicy"] = True

    # General keywords
    words = [w for w in re.findall(r'\w+', q_lower) if len(w) > 3 and w not in [
        "show", "food", "me", "meals", "under", "below", "high", "protein", "vegetarian", "healthy"
    ]]
    intent["keywords"] = words

    return intent
