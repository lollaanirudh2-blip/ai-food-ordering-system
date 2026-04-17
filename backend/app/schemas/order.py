from pydantic import BaseModel
from typing import List

class CreateOrderResponse(BaseModel):
    order_id: int
    total_amount: float
    delivery_fee: float
    tax_amount: float
    final_amount: float
    status: str
    payment_status: str

class OrderHistoryItem(BaseModel):
    id: int
    final_amount: float
    status: str
    payment_status: str

    class Config:
        from_attributes = True