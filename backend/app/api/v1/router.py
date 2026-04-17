from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    otp,
    restaurants,
    cart,
    orders,
    payments,
    events,
    recommendations,
    analytics,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(otp.router, prefix="/auth", tags=["OTP"])
api_router.include_router(restaurants.router, prefix="/restaurants", tags=["Restaurants"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])