from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.services.recommendation_service import get_home_recommendations, get_instant_suggestion, get_trending_items

router = APIRouter()

@router.get("/home")
def recommendation_home(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_home_recommendations(db, user_id=user["id"])

@router.get("/instant")
def instant_recommendation(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    suggestion = get_instant_suggestion(db, user_id=user["id"])

    if not suggestion:
        return {"message": "No suggestion available right now"}

    return suggestion

@router.get("/trending")
def trending_recommendations(
    db: Session = Depends(get_db),
):
    return get_trending_items(db)