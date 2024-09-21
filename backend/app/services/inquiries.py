import uuid
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from main import get_session
from sqlalchemy.orm import Session
from sqlmodel import Session, func, select
from users import get_current_user

from app.core.db import engine
from app.models import Inquiry, InquiryCreate, InquiryPublic


def create_inquiry(*, session: Session, inquiry_in: InquiryCreate) -> Inquiry:
    db_inquiry = Inquiry.model_validate(inquiry_in)
    session.add(db_inquiry)
    session.commit()
    session.refresh(db_inquiry)
    return db_inquiry


def get_inquiry_by_text(*, session: Session, text: str) -> Inquiry | None:
    statement = select(Inquiry).where(Inquiry.text == text)
    session_text = session.exec(statement).first()
    return session_text


def get_inquiry_by_id(*, session: Session, inquiry_id: uuid.UUID) -> Inquiry | None:
    statement = select(Inquiry).where(Inquiry.id == inquiry_id)
    session_text = session.exec(statement).first()
    return session_text


def get_inquiries(
    *, session: Session, skip: int = 0, limit: int = 100
) -> list[Inquiry]:
    statement = select(Inquiry).offset(skip).limit(limit)
    result = session.exec(statement).all()
    return list(result)


def count_inquiries(*, session: Session) -> int:
    statement = select(func.count()).select_from(Inquiry)
    return session.exec(statement).one()


router = APIRouter()


@router.put("/api/inquiries/{inquiry_id}", response_model=InquiryPublic)
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

    return inquiry
