from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.restaurant import RestaurantResponse
from app.schemas.menu_item import MenuItemResponse
from app.services.restaurant_service import (
    get_all_restaurants,
    get_restaurant_by_id,
    get_menu_by_restaurant_id,
)
from app.dependencies.auth import get_current_user
from app.services.search_service import search_restaurants

router = APIRouter()

@router.get("/", response_model=list[RestaurantResponse])
def list_restaurants(db: Session = Depends(get_db)):
    return get_all_restaurants(db)

@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = get_restaurant_by_id(db, restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.get("/{restaurant_id}/menu", response_model=list[MenuItemResponse])
def get_restaurant_menu(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = get_restaurant_by_id(db, restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return get_menu_by_restaurant_id(db, restaurant_id)
@router.get("/search")
def search_restaurant_list(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    results = search_restaurants(db, user_id=user["id"], query=q)
    return [
        {
            "id": restaurant.id,
            "name": restaurant.name,
            "cuisine": restaurant.cuisine,
            "description": restaurant.description,
            "rating": float(restaurant.rating) if restaurant.rating is not None else 0,
            "delivery_time_minutes": restaurant.delivery_time_minutes,
            "location": restaurant.location,
            "is_open": restaurant.is_open,
        }
        for restaurant in results
    ]