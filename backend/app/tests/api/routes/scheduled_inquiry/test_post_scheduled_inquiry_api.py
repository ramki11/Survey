import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import InquiryCreate
from app.models.scheduled_inquiry import ScheduledInquiryPublic
from app.services import inquiries as inquiries_service


def test_post_scheduled_inquiry_when_called_with_inquiry_id_that_doesnt_exist_should_return_400(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_inquiry_id = "f4d24b3e-a1af-437d-8dc4-2d50a7608725"
    test_dto = {"inquiry_id": invalid_inquiry_id}

    response = client.post(
        f"{settings.API_V1_STR}/scheduledinquiries/",
        headers=superuser_token_headers,
        json=test_dto,
    )

    assert response.status_code == 400


def test_post_scheduled_inquiry_when_called_with_inquiry_id_that_exists_should_return_scheduled_inquiry(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    inquiry_in = InquiryCreate(text="Testing the happy path")
    db_inquiry = inquiries_service.create_inquiry(session=db, inquiry_in=inquiry_in)
    test_dto = {"inquiry_id": str(db_inquiry.id)}

    response = client.post(
        f"{settings.API_V1_STR}/scheduledinquiries/",
        headers=superuser_token_headers,
        json=test_dto,
    )

    assert response.status_code == 200
    content = str(response.json())
    assert "inquiry_id" in content
