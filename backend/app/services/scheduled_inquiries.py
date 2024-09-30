from uuid import UUID

from sqlmodel import Session, desc, func, select

from app.models import ScheduledInquiry, ScheduledInquiryBase, ScheduledInquiryCreate
from app.models.scheduled_inquiry import ScheduledInquiryPublic


def create_scheduled_inquiry(*, session: Session, inquiry_id: UUID) -> ScheduledInquiry:
    highest_rank = session.exec(
        select(ScheduledInquiry.rank).order_by(desc(ScheduledInquiry.rank))
    ).first()

    rank = highest_rank + 1 if highest_rank else 1

    scheduled_inquiry = ScheduledInquiryBase(inquiry_id=inquiry_id, rank=rank)

    db_inquiry = ScheduledInquiry.model_validate(scheduled_inquiry)

    session.add(db_inquiry)
    session.commit()
    session.refresh(db_inquiry)
    return db_inquiry


"""
def get_inquiry_by_text(*, session: Session, text: str) -> Inquiry | None:
    statement = select(Inquiry).where(Inquiry.text == text)
    session_text = session.exec(statement).first()
    return session_text


def get_inquiry_by_id(*, session: Session, inquiry_id: UUID) -> Inquiry | None:
    statement = select(Inquiry).where(Inquiry.id == inquiry_id)
    session_text = session.exec(statement).first()
    return session_text


def get_inquiries(
    *, session: Session, skip: int = 0, limit: int = 100
) -> list[Inquiry]:
    if skip < 0:
        raise ValueError("Invalid value for 'skip': it must be non-negative")
    if limit < 0:
        raise ValueError("Invalid value for 'limit': it must be non-negative")
    statement = select(Inquiry).offset(skip).limit(limit)
    result = session.exec(statement).all()
    return list(result)


def count_inquiries(*, session: Session) -> int:
    statement = select(func.count()).select_from(Inquiry)
    return session.exec(statement).one()
"""
