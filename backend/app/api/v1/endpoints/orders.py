from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.services.order_service import create_order_from_cart, get_orders_by_user, reorder_order, get_order_details

router = APIRouter()

@router.post("/create")
def create_order(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    order = create_order_from_cart(db, user_id=user["id"])
    if not order:
        raise HTTPException(status_code=400, detail="Cart is empty")

    return {
        "order_id": order.id,
        "total_amount": float(order.total_amount),
        "delivery_fee": float(order.delivery_fee),
        "tax_amount": float(order.tax_amount),
        "final_amount": float(order.final_amount),
        "status": order.status,
        "payment_status": order.payment_status,
    }

@router.get("/")
def get_orders(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    orders = get_orders_by_user(db, user_id=user["id"])
    return [
        {
            "id": order.id,
            "final_amount": float(order.final_amount),
            "status": order.status,
            "payment_status": order.payment_status,
        }
        for order in orders
    ]
@router.post("/{order_id}/reorder")
def reorder(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    result = reorder_order(db, user_id=user["id"], order_id=order_id)
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    return result
@router.get("/{order_id}")
def get_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    order = get_order_details(db, user_id=user["id"], order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order