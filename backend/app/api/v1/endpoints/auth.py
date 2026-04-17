from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest
from app.services.auth_service import signup_user, login_user
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user = signup_user(db, data.full_name, data.email, data.password)
    if not user:
        raise HTTPException(status_code=400, detail="User already exists")
    return {"message": "Signup successful"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(db, data.email, data.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "OTP sent to email"}
# 🔐 Protected route
@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Protected route accessed",
        "user": current_user
    }