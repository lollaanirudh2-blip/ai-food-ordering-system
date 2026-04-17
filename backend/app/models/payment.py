from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP, DECIMAL
from sqlalchemy.sql import func
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), unique=True)
    transaction_id = Column(String(100), unique=True, nullable=False)
    payment_method = Column(String(50), default="MOCK")
    amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(50), default="PENDING")
    paid_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())