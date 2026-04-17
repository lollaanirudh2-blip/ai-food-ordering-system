from sqlalchemy.orm import Session
from app.models.restaurant import Restaurant
from app.models.menu_item import MenuItem

def get_all_restaurants(db: Session):
    return db.query(Restaurant).order_by(Restaurant.id.asc()).all()

def get_restaurant_by_id(db: Session, restaurant_id: int):
    return db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

def get_menu_by_restaurant_id(db: Session, restaurant_id: int):
    return (
        db.query(MenuItem)
        .filter(MenuItem.restaurant_id == restaurant_id)
        .order_by(MenuItem.id.asc())
        .all()
    )