from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.analytics_service import get_dashboard_data

router = APIRouter()

@router.get("/dashboard")
def analytics_dashboard(db: Session = Depends(get_db)):
    return get_dashboard_data(db)