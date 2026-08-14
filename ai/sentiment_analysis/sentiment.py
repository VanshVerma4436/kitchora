def analyze_review_sentiment(rating: int, comment: str = "") -> str:
    """
    Classifies review sentiment into POSITIVE, NEUTRAL, or NEGATIVE.
    """
    if rating >= 4:
        return "POSITIVE"
    elif rating == 3:
        return "NEUTRAL"
    else:
        return "NEGATIVE"
