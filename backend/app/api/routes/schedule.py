import datetime
import json

from fastapi import APIRouter, HTTPException

import app.services.schedule as schedule_service
from app.api.deps import SessionDep
from app.models import ScheduleCreate, ScheduleInfo, SchedulePublic

router = APIRouter()


def verify_schedule(schedule: ScheduleInfo) -> None:
    try:
        datetime.datetime.strptime(
            f"{schedule.startDate} {schedule.timesOfDay[0]}", "%Y-%m-%d %H:%M"
        )
        if hasattr(schedule, "endDate"):
            datetime.datetime.strptime(
                f"{schedule.endDate} {schedule.timesOfDay[0]}", "%Y-%m-%d %H:%M"
            )

    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="Schedule input is not valid.",
        )


def convert_schedule_string_to_schedule_data(
    schedule_string: str,
) -> ScheduleInfo:
    try:
        return ScheduleInfo.model_validate_json(schedule_string)
    except Exception:
        raise ValueError("Could not retrieve schedule")


def convert_string_to_schedule_inquiries_data(
    scheduled_inquiries: str,
) -> list[int]:
    if scheduled_inquiries:
        try:
            val: list[int] = json.loads(scheduled_inquiries)
            return val
        except Exception:
            raise ValueError("Could not retrieve schedule")
    return []


@router.post("/", response_model=SchedulePublic)
def create_schedule(
    *, session: SessionDep, schedule_in: ScheduleCreate
) -> SchedulePublic | None:
    verify_schedule(schedule_in.schedule)
    db_schedule = schedule_service.create_schedule(
        session=session, schedule_in=schedule_in
    )
    schedule_data = convert_schedule_string_to_schedule_data(
        schedule_string=db_schedule.schedule
    )
    return SchedulePublic(
        id=db_schedule.id,
        schedule=schedule_data,
        scheduled_inquiries=convert_string_to_schedule_inquiries_data(
            db_schedule.scheduled_inquiries
        ),
    )


@router.patch("/update_scheduled_inquiries", response_model=SchedulePublic)
def update_scheduled_inquiries(
    *, session: SessionDep, scheduled_inquiries: list[int]
) -> SchedulePublic:
    db_schedule = schedule_service.update_scheduled_inquiries(
        session=session, scheduled_inquiries=scheduled_inquiries
    )
    schedule_data = convert_schedule_string_to_schedule_data(
        schedule_string=db_schedule.schedule
    )
    scheduled_inquiries = convert_string_to_schedule_inquiries_data(
        scheduled_inquiries=db_schedule.scheduled_inquiries
    )
    return SchedulePublic(
        id=db_schedule.id,
        schedule=schedule_data,
        scheduled_inquiries=scheduled_inquiries,
    )


@router.get("/", response_model=SchedulePublic | None)
def get_schedule(*, session: SessionDep) -> SchedulePublic | None:
    db_schedule = schedule_service.get_schedule(session)
    if db_schedule is None:
        return None
    schedule_data = convert_schedule_string_to_schedule_data(
        schedule_string=db_schedule.schedule
    )
    scheduled_inquiries = convert_string_to_schedule_inquiries_data(
        scheduled_inquiries=db_schedule.scheduled_inquiries
    )
    return SchedulePublic(
        id=db_schedule.id,
        schedule=schedule_data,
        scheduled_inquiries=scheduled_inquiries,
    )
