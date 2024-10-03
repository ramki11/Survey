from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models import InquiryCreate
from app.services import inquiries as inquiries_service
from app.tests.utils.api_post import api_post

route_prefix = "scheduledinquiries"


def test_add_to_schedule_when_called_with_invalid_inquiry_id_returns_422(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_inquiry_id = "f4d24b3e-a1af-437d-8dc4-2d50a7608725"
    test_dto = {"inquiry_id": invalid_inquiry_id}

    content = api_post(
        client=client,
        headers=superuser_token_headers,
        prefix=route_prefix,
        data=test_dto,
        expected_status=422,
    )

    assert content["detail"] == "Inquiry not found"


def test_post_scheduled_inquiry_when_called_with_inquiry_id_that_exists_should_return_scheduled_inquiry(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    inquiry_in = InquiryCreate(text="Testing the happy path")
    db_inquiry = inquiries_service.create_inquiry(session=db, inquiry_in=inquiry_in)
    test_dto = {"inquiry_id": str(db_inquiry.id)}

    content = api_post(
        client=client,
        headers=superuser_token_headers,
        prefix=route_prefix,
        data=test_dto,
        expected_status=200,
    )

    assert "inquiry_id" in str(content)
