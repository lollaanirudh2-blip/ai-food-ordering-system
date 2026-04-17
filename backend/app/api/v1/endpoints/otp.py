from fastapi import APIRouter, HTTPException
from app.schemas.auth import OTPVerifyRequest
from app.services.otp_service import verify_otp
from app.core.security import create_access_token  # 👈 add this

router = APIRouter()

@router.post("/verify-otp")
def verify(data: OTPVerifyRequest):
    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # 🔑 Generate JWT token
    token = create_access_token({"sub": data.email})

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }