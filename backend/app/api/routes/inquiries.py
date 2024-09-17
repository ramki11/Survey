from fastapi import APIRouter, HTTPException

import app.services.inquiries as inquiries_service
from app.api.deps import SessionDep
from app.models import Inquiry, InquiryCreate, InquiryPublic

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