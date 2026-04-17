from pydantic import BaseModel

class AddToCartRequest(BaseModel):
    menu_item_id: int
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: int
    user_id: int
    menu_item_id: int
    quantity: int

    class Config:
        from_attributes = True