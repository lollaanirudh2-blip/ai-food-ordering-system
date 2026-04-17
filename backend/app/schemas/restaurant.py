from pydantic import BaseModel
from decimal import Decimal

class RestaurantResponse(BaseModel):
    id: int
    name: str
    cuisine: str | None = None
    description: str | None = None
    rating: Decimal | None = None
    delivery_time_minutes: int | None = None
    location: str | None = None
    is_open: bool

    class Config:
        from_attributes = True