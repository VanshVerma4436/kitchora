from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api.deps import get_db

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "Kitchora API", "version": "1.0.0"}

@router.get("/health/db")
def health_check_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected", "status": "healthy"}
    except Exception as e:
        return {"database": "disconnected", "error": str(e), "status": "unhealthy"}

@router.get("/health/seed")
def seed_live_db():
    from app.db.seed import seed_database
    try:
        seed_database()
        return {"status": "success", "message": "Live database seeded successfully!"}
    except Exception as e:
        return {"status": "error", "error": str(e)}
