import random
from datetime import datetime, timedelta

otp_store = {}

def generate_otp(email: str):
    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=5)

    otp_store[email] = {
        "otp": otp,
        "expires_at": expiry
    }

    return otp

def verify_otp(email: str, otp: str):
    record = otp_store.get(email)

    if not record:
        return False

    if record["otp"] != otp:
        return False

    if datetime.utcnow() > record["expires_at"]:
        return False

    del otp_store[email]
    return True