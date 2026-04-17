from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP, DECIMAL
from sqlalchemy.sql import func
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="SET NULL"), nullable=True)
    address_id = Column(Integer, nullable=True)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    delivery_fee = Column(DECIMAL(10, 2), default=0.00)
    tax_amount = Column(DECIMAL(10, 2), default=0.00)
    final_amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(50), default="PENDING")
    payment_status = Column(String(50), default="UNPAID")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())