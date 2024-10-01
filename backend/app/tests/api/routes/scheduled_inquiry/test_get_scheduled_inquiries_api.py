from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import Inquiry, InquiryCreate
from app.services import inquiries as inquiries_service
from app.services import scheduled_inquiries as scheduled_inquiries_service

route_prefix = "scheduledinquiries"


# Populate the db with two test inquiries
@pytest.fixture
def db_inquiries(db: Session) -> Generator[tuple[Inquiry, Inquiry]]:
    # Setup
    inquiry_in_1 = InquiryCreate(text="Test inquiry 1.")
    inquiry_in_2 = InquiryCreate(text="Test inquiry 2.")
    db_inquiry_1 = inquiries_service.create_inquiry(session=db, inquiry_in=inquiry_in_1)
    db_inquiry_2 = inquiries_service.create_inquiry(session=db, inquiry_in=inquiry_in_2)

    yield db_inquiry_1, db_inquiry_2

    # Teardown
    db.delete(db_inquiry_1)
    db.delete(db_inquiry_2)


def test_get_scheduled_inquiries_when_scheduled_inquiries_exist_should_return_all(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: Session,
    db_inquiries: tuple[Inquiry, Inquiry],
) -> None:
    initial_response = client.get(
        f"{settings.API_V1_STR}/{route_prefix}/",
        headers=superuser_token_headers,
    )

    assert initial_response.status_code == 200

    initial_content = initial_response.json()
    initial_length = initial_content["count"]

    scheduled_inquiries_service.create(session=db, inquiry_id=db_inquiries[0].id)
    scheduled_inquiries_service.create(session=db, inquiry_id=db_inquiries[1].id)

    second_response = client.get(
        f"{settings.API_V1_STR}/{route_prefix}/",
        headers=superuser_token_headers,
    )

    assert second_response.status_code == 200

    new_content = second_response.json()
    new_length = new_content["count"]

    assert new_length == initial_length + 2
