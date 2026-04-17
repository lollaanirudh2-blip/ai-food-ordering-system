from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.behavior_event import BehaviorEvent
from app.models.user import User

def get_dashboard_summary(db: Session):
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.coalesce(func.sum(Order.final_amount), 0)).scalar() or 0
    total_events = db.query(func.count(BehaviorEvent.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0

    return {
        "total_orders": int(total_orders),
        "total_revenue": float(total_revenue),
        "total_events": int(total_events),
        "total_users": int(total_users),
    }


def get_top_ordered_items(db: Session, limit: int = 5):
    rows = (
        db.query(
            OrderItem.item_name,
            func.sum(OrderItem.quantity).label("total_quantity")
        )
        .group_by(OrderItem.item_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "item_name": row.item_name,
            "total_quantity": int(row.total_quantity)
        }
        for row in rows
    ]


def get_top_event_types(db: Session, limit: int = 5):
    rows = (
        db.query(
            BehaviorEvent.event_type,
            func.count(BehaviorEvent.id).label("total_count")
        )
        .group_by(BehaviorEvent.event_type)
        .order_by(func.count(BehaviorEvent.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "event_type": row.event_type,
            "total_count": int(row.total_count)
        }
        for row in rows
    ]


def get_dashboard_data(db: Session):
    return {
        "summary": get_dashboard_summary(db),
        "top_ordered_items": get_top_ordered_items(db),
        "top_event_types": get_top_event_types(db),
    }