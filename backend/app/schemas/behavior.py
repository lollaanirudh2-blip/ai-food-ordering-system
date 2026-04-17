from pydantic import BaseModel

class TrackEventRequest(BaseModel):
    event_type: str
    restaurant_id: int | None = None
    menu_item_id: int | None = None
    search_query: str | None = None
    event_metadata: str | None = None