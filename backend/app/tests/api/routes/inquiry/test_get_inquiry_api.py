import uuid

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import Inquiry


@pytest.fixture(name="single_inquiry", scope="function")
def fixture_single_inquiry(db: Session) -> Inquiry:
    single_inquiry = Inquiry(text="How's your work-life balance?")
    db.add(single_inquiry)
    db.commit()
    return single_inquiry


def test_getInquiryAPI_whenCalledWithExistentId_shouldReturnInquiry(
    client: TestClient, superuser_token_headers: dict[str, str], single_inquiry: Inquiry
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/inquiries/{single_inquiry.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == str(single_inquiry.id)
    assert content["text"] == single_inquiry.text


def test_getInquiryAPI_whenCalledWithNonExistentId_shouldReturnNotFound(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    random_uuid = uuid.uuid4()
    response = client.get(
        f"{settings.API_V1_STR}/inquiries/{random_uuid}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Inquiry not found"


def test_getInquiryAPI_whenCalledWithInvalidIdType_shouldReturnBadRequest(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_inquiry_ids = ["12345", "abcde"]
    for inquiry_id in invalid_inquiry_ids:
        response = client.get(
            f"{settings.API_V1_STR}/inquiries/{inquiry_id}",
            headers=superuser_token_headers,
        )
        assert response.status_code == 422
        content = response.json()
        assert content["detail"][0]["type"] == "uuid_parsing"