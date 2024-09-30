from fastapi import APIRouter, HTTPException

from app.api.deps import SessionDep
from app.models import ScheduledInquiry, ScheduledInquiryCreate, ScheduledInquiryPublic
from app.services import (
    inquiries as inquiries_service,
)
from app.services import (
    scheduled_inquiries as scheduled_inquiries_service,
)

router = APIRouter()


@router.post("/", response_model=ScheduledInquiryPublic)
def create_scheduled_inquiry(
    *,
    session: SessionDep,
    scheduled_inquiry_in: ScheduledInquiryCreate,
) -> ScheduledInquiryPublic:
    inquiry_id = scheduled_inquiry_in.inquiry_id

    inquiry_exists = inquiries_service.get_inquiry_by_id(
        session=session, inquiry_id=inquiry_id
    )

    if not inquiry_exists:
        raise HTTPException(status_code=400, detail="Inquiry not found")

    data = scheduled_inquiries_service.create_scheduled_inquiry(
        session=session, inquiry_id=inquiry_id
    )

    return ScheduledInquiryPublic(
        inquiry_id=data.inquiry_id, rank=data.rank, id=data.id
    )


"""
@router.get("/", response_model=InquriesPublic)
def get_inquries(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> InquriesPublic:
    if skip < 0:
        raise HTTPException(
            status_code=400, detail="Invalid value for 'skip': it must be non-negative"
        )
    if limit <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid value for 'limit': it must be non-negative",
        )

    count = inquiries_service.count_inquiries(session=session)
    inquiries = inquiries_service.get_inquiries(session=session, skip=skip, limit=limit)
    return InquriesPublic(data=inquiries, count=count)


@router.get("/{inquiry_id}", response_model=InquiryPublic)
def read_inquiry(session: SessionDep, inquiry_id: uuid.UUID) -> Inquiry:
    inquiry = inquiries_service.get_inquiry_by_id(
        session=session, inquiry_id=inquiry_id
    )
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry
"""
