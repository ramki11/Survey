from fastapi import APIRouter

from app.api.routes import (
    auth,
    inquiries,
    schedule,
    themes,
    users,
    utils,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["inquiries"])
api_router.include_router(themes.router, prefix="/themes", tags=["themes"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(schedule.router, prefix="/schedule", tags=["schedule"])
