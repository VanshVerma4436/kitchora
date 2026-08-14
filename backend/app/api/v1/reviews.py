from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.schemas_db import User, Review, Kitchen
from app.schemas.pydantic_schemas import ReviewCreate, ReviewResponse
from ai.sentiment_analysis.sentiment import analyze_review_sentiment

router = APIRouter()

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    kitchen = db.query(Kitchen).filter(Kitchen.id == review_in.kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")

    sentiment = analyze_review_sentiment(review_in.rating, review_in.comment or "")

    review = Review(
        user_id=current_user.id,
        kitchen_id=review_in.kitchen_id,
        rating=review_in.rating,
        comment=review_in.comment,
        sentiment_tag=sentiment
    )
    db.add(review)

    # Recalculate kitchen average rating
    all_reviews = db.query(Review).filter(Review.kitchen_id == review_in.kitchen_id).all()
    ratings_sum = sum(r.rating for r in all_reviews) + review_in.rating
    new_count = len(all_reviews) + 1
    kitchen.rating = round(ratings_sum / new_count, 1)
    kitchen.total_ratings = new_count

    db.commit()
    db.refresh(review)

    return {
        "id": review.id,
        "user_name": current_user.full_name,
        "rating": review.rating,
        "comment": review.comment,
        "sentiment_tag": review.sentiment_tag,
        "created_at": review.created_at
    }

@router.get("/kitchen/{kitchen_id}", response_model=List[ReviewResponse])
def get_kitchen_reviews(kitchen_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.kitchen_id == kitchen_id).order_by(Review.created_at.desc()).all()
    res = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        res.append({
            "id": r.id,
            "user_name": user.full_name if user else "Customer",
            "rating": r.rating,
            "comment": r.comment,
            "sentiment_tag": r.sentiment_tag,
            "created_at": r.created_at
        })
    return res
