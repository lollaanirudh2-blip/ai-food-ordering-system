import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.order import Order
from app.models.payment import Payment
from app.models.cart_item import CartItem

def process_mock_payment(db: Session, user_id: int, order_id: int):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()

    if not order:
        return None

    transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"

    payment = Payment(
        order_id=order.id,
        transaction_id=transaction_id,
        payment_method="MOCK",
        amount=order.final_amount,
        status="SUCCESS",
        paid_at=datetime.utcnow(),
    )

    db.add(payment)

    order.payment_status = "PAID"
    order.status = "CONFIRMED"

    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    db.commit()
    return {
        "message": "Payment successful",
        "transaction_id": transaction_id,
        "order_id": order.id,
        "payment_status": order.payment_status,
        "order_status": order.status,
    }