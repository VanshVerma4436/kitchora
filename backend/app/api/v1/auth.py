from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.schemas_db import User, UserPreference, LoyaltyAccount, RoleEnum
from app.schemas.pydantic_schemas import UserCreate, UserResponse, UserLogin, Token

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email address already exists."
        )

    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Initialize user preference & loyalty account
    pref = UserPreference(user_id=db_user.id)
    db.add(pref)
    
    referral_code = f"KITCHORA{db_user.id:04d}"
    loyalty = LoyaltyAccount(user_id=db_user.id, points_balance=100, referral_code=referral_code)
    db.add(loyalty)

    db.commit()
    return db_user

DEMO_ACCOUNTS = {
    "demo@kitchora.com": ("password123", RoleEnum.CUSTOMER, "Vansh Verma"),
    "chef@saffron.com": ("password123", RoleEnum.KITCHEN_OWNER, "Chef Ranveer Brar"),
    "admin@kitchora.com": ("password123", RoleEnum.ADMIN, "Kitchora Admin"),
}

@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        # Self-healing for 1-click demo accounts
        if user_in.email in DEMO_ACCOUNTS and user_in.password == DEMO_ACCOUNTS[user_in.email][0]:
            pwd, role, name = DEMO_ACCOUNTS[user_in.email]
            if not user:
                user = User(
                    email=user_in.email,
                    hashed_password=get_password_hash(pwd),
                    full_name=name,
                    phone="+91 98765 00000",
                    role=role
                )
                db.add(user)
            else:
                user.hashed_password = get_password_hash(pwd)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
    
    token = create_access_token(subject=str(user.id))
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
