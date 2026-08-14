import os
import sys
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

import logging
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.schemas_db import (
    User, RoleEnum, Kitchen, Category, MenuItem, MenuCustomization,
    Ingredient, Inventory, InventoryStatusEnum, Coupon, Address, LoyaltyAccount, Review
)

logger = logging.getLogger("kitchora.seed")

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        demo_users_data = [
            {
                "email": "demo@kitchora.com",
                "password": "password123",
                "full_name": "Vansh Verma",
                "phone": "+91 98765 43210",
                "role": RoleEnum.CUSTOMER
            },
            {
                "email": "chef@saffron.com",
                "password": "password123",
                "full_name": "Chef Ranveer Brar",
                "phone": "+91 98765 11111",
                "role": RoleEnum.KITCHEN_OWNER
            },
            {
                "email": "admin@kitchora.com",
                "password": "password123",
                "full_name": "Kitchora Admin",
                "phone": "+91 98765 99999",
                "role": RoleEnum.ADMIN
            }
        ]

        for udata in demo_users_data:
            existing = db.query(User).filter(User.email == udata["email"]).first()
            if not existing:
                u = User(
                    email=udata["email"],
                    hashed_password=get_password_hash(udata["password"]),
                    full_name=udata["full_name"],
                    phone=udata["phone"],
                    role=udata["role"]
                )
                db.add(u)
                db.commit()
                db.refresh(u)
                if udata["role"] == RoleEnum.CUSTOMER:
                    addr = Address(
                        user_id=u.id,
                        address_line1="Flat 402, Cyber Heights",
                        address_line2="Hitech City",
                        city="Hyderabad",
                        state="Telangana",
                        pincode="500081",
                        is_default=True
                    )
                    loyalty = LoyaltyAccount(
                        user_id=u.id,
                        points_balance=450,
                        tier="GOLD",
                        referral_code="VANSH2026"
                    )
                    db.add_all([addr, loyalty])
                    db.commit()
            else:
                existing.hashed_password = get_password_hash(udata["password"])
                db.commit()

        # Categories
        cat_names = ["Hyderabadi Biryani", "North Indian Specials", "South Indian Tiffin", "Indo-Chinese & Street", "Artisanal Pizza", "Desserts & Sweets", "High-Protein Bowls"]
        cat_map = {}
        for idx, cname in enumerate(cat_names):
            cat = db.query(Category).filter(Category.name == cname).first()
            if not cat:
                cat = Category(name=cname, icon="🍲", display_order=idx + 1)
                db.add(cat)
                db.commit()
                db.refresh(cat)
            cat_map[cname] = cat

        # Kitchens
        k1 = db.query(Kitchen).filter(Kitchen.slug == "saffron-spice").first()
        if not k1:
            k1 = Kitchen(
                name="Saffron & Spice Cloud Kitchen",
                slug="saffron-spice",
                description="Authentic royal Awadhi and Hyderabadi dum biryanis cooked in clay handis.",
                address="Plot 12, Financial District, Gachibowli, Hyderabad",
                cuisine_tags=["Biryani", "Hyderabadi", "Mughlai", "North Indian"],
                banner_image="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
                rating=4.8,
                total_ratings=1420,
                avg_prep_time_mins=25
            )
            db.add(k1)
            db.commit()
            db.refresh(k1)

        k2 = db.query(Kitchen).filter(Kitchen.slug == "street-express").first()
        if not k2:
            k2 = Kitchen(
                name="Street Express Cloud Kitchen",
                slug="street-express",
                description="Iconic Indian street food classics: Chole Bhature, Dosa, Pav Bhaji, Idli, Chowmein & Pizza.",
                address="Madhapur Main Road, Hyderabad",
                cuisine_tags=["Street Food", "South Indian", "Indo-Chinese", "Pizza"],
                banner_image="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
                rating=4.9,
                total_ratings=980,
                avg_prep_time_mins=18
            )
            db.add(k2)
            db.commit()
            db.refresh(k2)

        # Menu items list
        sample_items = [
            # Biryanis & North Indian
            {
                "kitchen_id": k1.id, "category_id": cat_map["Hyderabadi Biryani"].id,
                "name": "Hyderabadi Chicken Dum Biryani",
                "description": "Long-grain Basmati rice slow-cooked with tender spiced chicken leg piece and saffron.",
                "price": 320.0, "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
                "is_veg": False, "is_bestseller": True, "calories": 650, "protein_g": 38.0, "carbs_g": 72.0, "fat_g": 18.0, "spice_level": 4, "prep_time_mins": 25
            },
            {
                "kitchen_id": k1.id, "category_id": cat_map["North Indian Specials"].id,
                "name": "Paneer Butter Masala Handi",
                "description": "Soft cottage cheese cooked in rich creamy tomato butter gravy with fenugreek leaves.",
                "price": 290.0, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 480, "protein_g": 18.0, "carbs_g": 22.0, "fat_g": 26.0, "spice_level": 2, "prep_time_mins": 20
            },
            {
                "kitchen_id": k2.id, "category_id": cat_map["North Indian Specials"].id,
                "name": "Delhi Style Chole Bhature Handi",
                "description": "Piping hot fluffy golden bhaturas served with spicy authentic Amritsari chole.",
                "price": 180.0, "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 540, "protein_g": 16.0, "carbs_g": 68.0, "fat_g": 22.0, "spice_level": 3, "prep_time_mins": 15
            },
            # South Indian
            {
                "kitchen_id": k2.id, "category_id": cat_map["South Indian Tiffin"].id,
                "name": "Mysore Butter Masala Dosa",
                "description": "Crispy golden crepe smeared with red garlic chutney, potato masala, and dollop of white butter.",
                "price": 140.0, "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 390, "protein_g": 9.0, "carbs_g": 52.0, "fat_g": 16.0, "spice_level": 2, "prep_time_mins": 12
            },
            {
                "kitchen_id": k2.id, "category_id": cat_map["South Indian Tiffin"].id,
                "name": "Ghee Button Idli Sambar Plate",
                "description": "Mini steamed rice cakes soaked in hot piping sambar and served with fresh coconut chutney.",
                "price": 120.0, "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 310, "protein_g": 8.0, "carbs_g": 58.0, "fat_g": 5.0, "spice_level": 1, "prep_time_mins": 10
            },
            # Pav Bhaji & Chowmein
            {
                "kitchen_id": k2.id, "category_id": cat_map["Indo-Chinese & Street"].id,
                "name": "Special Amul Butter Pav Bhaji",
                "description": "Mashed spiced vegetable curry loaded with Amul butter served with hot toasted buttery pavs.",
                "price": 160.0, "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 460, "protein_g": 11.0, "carbs_g": 54.0, "fat_g": 22.0, "spice_level": 3, "prep_time_mins": 15
            },
            {
                "kitchen_id": k2.id, "category_id": cat_map["Indo-Chinese & Street"].id,
                "name": "Schezwan Street Chowmein",
                "description": "High-flame wok tossed Hakka noodles with crunchy vegetables and tangy Schezwan sauce.",
                "price": 170.0, "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80",
                "is_veg": True, "is_bestseller": False, "calories": 420, "protein_g": 10.0, "carbs_g": 62.0, "fat_g": 14.0, "spice_level": 4, "prep_time_mins": 15
            },
            # Pizza
            {
                "kitchen_id": k2.id, "category_id": cat_map["Artisanal Pizza"].id,
                "name": "Truffle Mushroom Pizza",
                "description": "Woodfired sourdough crust topped with wild mushrooms, mozzarella cheese, and white truffle oil.",
                "price": 390.0, "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 680, "protein_g": 26.0, "carbs_g": 78.0, "fat_g": 28.0, "spice_level": 1, "prep_time_mins": 25
            },
            # Desserts
            {
                "kitchen_id": k2.id, "category_id": cat_map["Desserts & Sweets"].id,
                "name": "Belgian Chocolate Truffle Cake",
                "description": "Rich moist dark chocolate sponge layered with Belgian cocoa ganache and truffle glaze.",
                "price": 240.0, "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
                "is_veg": True, "is_bestseller": True, "calories": 450, "protein_g": 6.0, "carbs_g": 52.0, "fat_g": 24.0, "spice_level": 0, "prep_time_mins": 20
            },
            {
                "kitchen_id": k2.id, "category_id": cat_map["Desserts & Sweets"].id,
                "name": "Kesari Rasgulla Handi (4 Pcs)",
                "description": "Traditional spongy Bengali chenna rasgullas steeped in saffron cardamom sugar syrup.",
                "price": 130.0, "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80",
                "is_veg": True, "is_bestseller": False, "calories": 280, "protein_g": 7.0, "carbs_g": 58.0, "fat_g": 3.0, "spice_level": 0, "prep_time_mins": 10
            }
        ]

        for item_data in sample_items:
            existing = db.query(MenuItem).filter(MenuItem.name == item_data["name"]).first()
            if not existing:
                mi = MenuItem(**item_data)
                db.add(mi)
        db.commit()

        # Coupons
        for ccode, dperc, mval in [("KITCHORA20", 20.0, 200.0), ("WELCOME100", 25.0, 250.0)]:
            cp = db.query(Coupon).filter(Coupon.code == ccode).first()
            if not cp:
                db.add(Coupon(code=ccode, discount_percentage=dperc, min_order_value=mval))
        db.commit()

        logger.info("Successfully seeded real-time database endpoints with dishes and kitchens!")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
