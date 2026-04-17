from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.services.otp_service import generate_otp
from app.services.email_service import send_otp_email

def signup_user(db: Session, full_name: str, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        return None

    new_user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    otp = generate_otp(email)
    send_otp_email(email, otp)

    return True