from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, DECIMAL
from sqlalchemy.sql import func
from app.core.database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    cuisine = Column(String(100))
    description = Column(Text)
    rating = Column(DECIMAL(2, 1), default=0.0)
    delivery_time_minutes = Column(Integer)
    location = Column(String(255))
    is_open = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())