from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.payment import MockPaymentRequest
from app.services.payment_service import process_mock_payment

router = APIRouter()

@router.post("/mock-pay")
def mock_pay(
    data: MockPaymentRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    result = process_mock_payment(db, user_id=user["id"], order_id=data.order_id)
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")

    return result