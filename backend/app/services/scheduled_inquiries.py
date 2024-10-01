from uuid import UUID

from sqlmodel import Session, desc, func, select

from app.models import ScheduledInquiry, ScheduledInquiryBase


def create(*, session: Session, inquiry_id: UUID) -> ScheduledInquiry:
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


def get_scheduled_inquiries(
    *, session: Session, skip: int = 0, limit: int = 100
) -> list[ScheduledInquiry]:
    if skip < 0:
        raise ValueError("Invalid value for 'skip': it must be non-negative")
    if limit < 0:
        raise ValueError("Invalid value for 'limit': it must be non-negative")

    statement = select(ScheduledInquiry).offset(skip).limit(limit)
    scheduled_inquiries = session.exec(statement).all()

    return list(scheduled_inquiries)


def get_count(*, session: Session) -> int:
    count_statement = select(func.count()).select_from(ScheduledInquiry)
    return session.exec(count_statement).one()
