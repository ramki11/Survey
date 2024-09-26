import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlmodel import Session

import app.services.inquiries as inquiries_service
from app.api.deps import SessionDep
from app.core.db import get_session
from app.models import Inquiry, InquiryCreate, InquiryPublic, InquriesPublic
from app.services import inquiries as inquiries_service

router = APIRouter()


@router.post("/", response_model=InquiryPublic)
def create_inquiry(*, session: SessionDep, inquiry_in: InquiryCreate) -> Inquiry:
    """
    Create new inquiry.
    """
    inquiry = inquiries_service.get_inquiry_by_text(
        session=session, text=inquiry_in.text
    )
    if inquiry:
        raise HTTPException(
            status_code=400,
            detail="This inquiry already exists.",
        )

    inquiry = Inquiry.model_validate(inquiry_in)
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)
    return inquiry


@router.get("/", response_model=InquriesPublic)
def get_inquries(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> InquriesPublic:
    """
    Retrieve inquries.
    """
    count = inquiries_service.count_inquiries(session=session)
    inquiries = inquiries_service.get_inquiries(session=session, skip=skip, limit=limit)
    return InquriesPublic(data=inquiries, count=count)


@router.get("/{inquiry_id}", response_model=InquiryPublic)
def read_inquiry(session: SessionDep, inquiry_id: uuid.UUID) -> Inquiry:
    """
    Get inquiry by ID
    """
    inquiry = inquiries_service.get_inquiry_by_id(
        session=session, inquiry_id=inquiry_id
    )
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.put("/api/inquiries/{inquiry_id}", response_model=InquiryPublic)
def edit_inquiry(
    inquiry_id: uuid.UUID,
    inquiry_update: InquiryCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not current_user["is_admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    inquiry = inquiries_service.get_inquiry_by_id(
        session=session, inquiry_id=inquiry_id
    )
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    if inquiry.responses:
        raise HTTPException(
            status_code=400, detail="Cannot edit inquiry with responses"
        )

    # Update the inquiry with the provided data
    inquiry.text = inquiry_update.text
    session.commit()

    return inquiry
