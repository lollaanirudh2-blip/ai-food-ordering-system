from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, DECIMAL, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"))
    name = Column(String(150), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    price = Column(DECIMAL(10, 2), nullable=False)
    is_veg = Column(Boolean, default=False)
    spice_level = Column(String(20))
    calories = Column(Integer)
    tags = Column(Text)
    is_available = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())