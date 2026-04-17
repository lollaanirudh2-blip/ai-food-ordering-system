from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.cart import AddToCartRequest
from app.services.cart_service import (
    add_to_cart,
    get_cart,
    remove_cart_item,
    increase_cart_item_quantity,
    decrease_cart_item_quantity,
)
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/add")
def add_item(
    data: AddToCartRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return add_to_cart(
        db,
        user_id=user["id"],
        menu_item_id=data.menu_item_id,
        quantity=data.quantity
    )


@router.get("/")
def get_cart_items(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_cart(db, user_id=user["id"])


@router.patch("/{cart_item_id}/increase")
def increase_quantity(
    cart_item_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    item = increase_cart_item_quantity(db, user_id=user["id"], cart_item_id=cart_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Quantity increased"}


@router.patch("/{cart_item_id}/decrease")
def decrease_quantity(
    cart_item_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    item = decrease_cart_item_quantity(db, user_id=user["id"], cart_item_id=cart_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Quantity decreased"}


@router.delete("/{cart_item_id}")
def delete_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return remove_cart_item(db, user_id=user["id"], cart_item_id=cart_item_id)