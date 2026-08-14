from typing import List, Dict, Any

def score_menu_items(
    menu_items: List[Dict[str, Any]], 
    user_diet: str = "ALL", 
    favorite_cuisines: List[str] = None,
    max_price: float = None
) -> List[Dict[str, Any]]:
    """
    Deterministic rule-based recommendation engine scoring dishes.
    Can be seamlessly swapped with ML matrix factorization / embeddings.
    """
    favorite_cuisines = favorite_cuisines or []
    scored_items = []

    for item in menu_items:
        score = 50.0  # Base score

        # Diet matching
        if user_diet == "VEG" and item.get("is_veg"):
            score += 30.0
        elif user_diet == "NON-VEG" and not item.get("is_veg"):
            score += 25.0

        # Bestseller boost
        if item.get("is_bestseller"):
            score += 20.0

        # Price constraint match
        if max_price and item.get("price", 0) <= max_price:
            score += 15.0

        # Protein content
        if item.get("protein_g", 0) > 15:
            score += 10.0

        item_copy = dict(item)
        item_copy["recommendation_score"] = score
        scored_items.append(item_copy)

    # Sort by score descending
    scored_items.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return scored_items
