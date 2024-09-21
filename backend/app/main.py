from uuid import UUID

import sentry_sdk
from fastapi import Depends, FastAPI, HTTPException
from fastapi.routing import APIRoute
from sqlmodel import Session
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.backend_pre_start import engine
from app.core.config import settings
from app.models import (
    Inquiry,
    InquiryCreate,
    InquiryPublic,
)


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def get_current_user():
    return {"is_admin": True}  # Mock admin user


def get_session():
    with Session(engine) as session:
        yield session


@app.put("/api/inquiries/{inquiry_id}", response_model=InquiryPublic)
def edit_inquiry(
    inquiry_id: UUID,
    inquiry_update: InquiryCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not current_user["is_admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    inquiry = session.get(Inquiry, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    if inquiry.responses:
        raise HTTPException(
            status_code=400, detail="Cannot edit inquiry with responses"
        )

    inquiry.text = inquiry_update.text
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)

    return inquiry


app.include_router(api_router, prefix=settings.API_V1_STR)
