from sqlalchemy.orm import Session
from app.models.cart_item import CartItem
from app.models.menu_item import MenuItem
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_item import OrderItem
from app.models.cart_item import CartItem

def create_order_from_cart(db: Session, user_id: int):
    cart_rows = (
        db.query(CartItem, MenuItem)
        .join(MenuItem, CartItem.menu_item_id == MenuItem.id)
        .filter(CartItem.user_id == user_id)
        .all()
    )

    if not cart_rows:
        return None

    total_amount = 0
    restaurant_id = None

    for cart_item, menu_item in cart_rows:
        total_amount += float(menu_item.price) * cart_item.quantity
        if restaurant_id is None:
            restaurant_id = menu_item.restaurant_id

    delivery_fee = 40.0
    tax_amount = round(total_amount * 0.05, 2)
    final_amount = total_amount + delivery_fee + tax_amount

    order = Order(
        user_id=user_id,
        restaurant_id=restaurant_id,
        total_amount=total_amount,
        delivery_fee=delivery_fee,
        tax_amount=tax_amount,
        final_amount=final_amount,
        status="PENDING",
        payment_status="UNPAID",
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for cart_item, menu_item in cart_rows:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=menu_item.id,
            item_name=menu_item.name,
            quantity=cart_item.quantity,
            price_at_time=menu_item.price,
            subtotal=float(menu_item.price) * cart_item.quantity,
        )
        db.add(order_item)

    db.commit()
    return order

def get_orders_by_user(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.id.desc()).all()

def reorder_order(db: Session, user_id: int, order_id: int):
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    if not order_items:
        return None

    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    for item in order_items:
        cart_item = CartItem(
            user_id=user_id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity
        )
        db.add(cart_item)

    db.commit()
    return {"message": "Items added to cart again"}

def get_order_details(db: Session, user_id: int, order_id: int):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )

    if not order:
        return None

    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id)
        .all()
    )

    return {
        "id": order.id,
        "total_amount": float(order.total_amount),
        "delivery_fee": float(order.delivery_fee),
        "tax_amount": float(order.tax_amount),
        "final_amount": float(order.final_amount),
        "status": order.status,
        "payment_status": order.payment_status,
        "created_at": str(order.created_at),
        "items": [
            {
                "id": item.id,
                "item_name": item.item_name,
                "quantity": item.quantity,
                "price_at_time": float(item.price_at_time),
                "subtotal": float(item.subtotal),
            }
            for item in items
        ]
    }