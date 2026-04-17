from sqlalchemy.orm import Session
from app.models.behavior_event import BehaviorEvent

def track_event(
    db: Session,
    user_id: int,
    event_type: str,
    restaurant_id: int | None = None,
    menu_item_id: int | None = None,
    search_query: str | None = None,
    event_metadata: str | None = None,
):
    event = BehaviorEvent(
        user_id=user_id,
        event_type=event_type,
        restaurant_id=restaurant_id,
        menu_item_id=menu_item_id,
        search_query=search_query,
        event_metadata=event_metadata,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event