import json

from sqlmodel import select

from app.api.deps import SessionDep
from app.models import Schedule, ScheduleCreate


def create_schedule(*, session: SessionDep, schedule_in: ScheduleCreate) -> Schedule:
    """
    Create new schedule.
    """
    schedule_as_string = schedule_in.schedule.model_dump_json()
    db_item = session.exec(select(Schedule)).first()
    if db_item:
        db_item.schedule = schedule_as_string
    else:
        db_item = Schedule(schedule=schedule_as_string, scheduled_inquiries="[]")
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def update_scheduled_inquiries(
    *, session: SessionDep, scheduled_inquiries: list[int]
) -> Schedule:
    """
    Update scheduled_inquiries.
    """
    scheduled_inquiries_as_string = json.dumps(scheduled_inquiries)
    db_item = session.exec(select(Schedule)).first()
    if not db_item:
        raise ValueError("Invalid schedule for update")
    db_item.scheduled_inquiries = scheduled_inquiries_as_string
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def get_schedule(session: SessionDep) -> Schedule | None:
    """
    Retrieve schedule.
    """
    return session.exec(select(Schedule)).first()
