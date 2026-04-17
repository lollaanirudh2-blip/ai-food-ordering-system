from pydantic import BaseModel
from decimal import Decimal

class MenuItemResponse(BaseModel):
    id: int
    restaurant_id: int
    name: str
    description: str | None = None
    category: str | None = None
    price: Decimal
    is_veg: bool
    spice_level: str | None = None
    calories: int | None = None
    tags: str | None = None
    is_available: bool

    class Config:
        from_attributes = True