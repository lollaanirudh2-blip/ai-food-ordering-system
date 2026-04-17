from pydantic import BaseModel

class MockPaymentRequest(BaseModel):
    order_id: int

class MockPaymentResponse(BaseModel):
    message: str
    transaction_id: str
    order_id: int
    payment_status: str
    order_status: str