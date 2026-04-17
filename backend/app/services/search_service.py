from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.restaurant import Restaurant
from app.models.search_history import SearchHistory
from app.models.behavior_event import BehaviorEvent

def search_restaurants(db: Session, user_id: int, query: str):
    results = (
        db.query(Restaurant)
        .filter(
            or_(
                Restaurant.name.ilike(f"%{query}%"),
                Restaurant.cuisine.ilike(f"%{query}%"),
                Restaurant.description.ilike(f"%{query}%"),
                Restaurant.location.ilike(f"%{query}%"),
            )
        )
        .all()
    )

    history = SearchHistory(
        user_id=user_id,
        search_query=query,
        result_count=len(results)
    )
    db.add(history)

    event = BehaviorEvent(
        user_id=user_id,
        event_type="search",
        search_query=query,
        event_metadata=f'{{"result_count": {len(results)}}}'
    )
    db.add(event)

    db.commit()

    return results