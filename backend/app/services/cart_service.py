from sqlalchemy.orm import Session
from app.models.cart_item import CartItem
from app.models.menu_item import MenuItem

def add_to_cart(db: Session, user_id: int, menu_item_id: int, quantity: int):
    item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.menu_item_id == menu_item_id
    ).first()

    if item:
        item.quantity += quantity
    else:
        item = CartItem(
            user_id=user_id,
            menu_item_id=menu_item_id,
            quantity=quantity
        )
        db.add(item)

    db.commit()
    db.refresh(item)
    return item


def get_cart(db: Session, user_id: int):
    cart_items = (
        db.query(CartItem, MenuItem)
        .join(MenuItem, CartItem.menu_item_id == MenuItem.id)
        .filter(CartItem.user_id == user_id)
        .all()
    )

    result = []
    for cart_item, menu_item in cart_items:
        result.append({
            "id": cart_item.id,
            "menu_item_id": menu_item.id,
            "name": menu_item.name,
            "description": menu_item.description,
            "price": float(menu_item.price),
            "quantity": cart_item.quantity,
            "subtotal": float(menu_item.price) * cart_item.quantity,
            "is_veg": menu_item.is_veg
        })

    return result


def increase_cart_item_quantity(db: Session, user_id: int, cart_item_id: int):
    item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == user_id
    ).first()

    if not item:
        return None

    item.quantity += 1
    db.commit()
    db.refresh(item)
    return item


def decrease_cart_item_quantity(db: Session, user_id: int, cart_item_id: int):
    item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == user_id
    ).first()

    if not item:
        return None

    if item.quantity > 1:
        item.quantity -= 1
        db.commit()
        db.refresh(item)
        return item

    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}


def remove_cart_item(db: Session, user_id: int, cart_item_id: int):
    item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == user_id
    ).first()

    if item:
        db.delete(item)
        db.commit()

    return True