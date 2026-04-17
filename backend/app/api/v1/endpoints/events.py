from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.behavior import TrackEventRequest
from app.services.behavior_service import track_event

router = APIRouter()

@router.post("/track")
def create_event(
    data: TrackEventRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    event = track_event(
        db=db,
        user_id=user["id"],
        event_type=data.event_type,
        restaurant_id=data.restaurant_id,
        menu_item_id=data.menu_item_id,
        search_query=data.search_query,
        event_metadata=data.event_metadata,
    )

    return {
        "message": "Event tracked successfully",
        "event_id": event.id
    }