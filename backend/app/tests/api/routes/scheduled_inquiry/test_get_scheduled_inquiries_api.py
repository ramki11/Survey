from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import InquiryCreate
from app.services import inquiries as inquiries_service
from app.services import scheduled_inquiries as scheduled_inquiries_service

path = f"{settings.API_V1_STR}/scheduledinquiries/"


def test_get_scheduled_inquiries_when_scheduled_inquiries_exist_should_return_all(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: Session,
) -> None:
    # Setup
    inquiry_in_1 = InquiryCreate(text="Test inquiry 1.")
    inquiry_in_2 = InquiryCreate(text="Test inquiry 2.")
    db_inquiry_1 = inquiries_service.create_inquiry(session=db, inquiry_in=inquiry_in_1)
    db_inquiry_2 = inquiries_service.create_inquiry(session=db, inquiry_in=inquiry_in_2)

    response = client.get(path, headers=superuser_token_headers)

    json = response.json()
    initial_count = json["count"]

    scheduled_inquiries_service.create(session=db, inquiry_id=db_inquiry_1.id)
    scheduled_inquiries_service.create(session=db, inquiry_id=db_inquiry_2.id)

    response = client.get(path, headers=superuser_token_headers)

    json = response.json()
    new_count = json["count"]

    assert new_count == initial_count + 2


def test_get_scheduled_inquiries_when_empty_returns_empty_list(
    client: TestClient,
    superuser_token_headers: dict[str, str],
) -> None:
    response = client.get(path, headers=superuser_token_headers)

    json = response.json()

    assert len(json["data"]) == 0
    assert json["count"] == 0
