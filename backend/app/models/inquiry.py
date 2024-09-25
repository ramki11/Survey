import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel

MIN_LENGTH = 10
MAX_LENGTH = 255


# Shared properties
class InquiryBase(SQLModel):
    text: str = Field(min_length=MIN_LENGTH, max_length=MAX_LENGTH)


# Properties to receive on inquiry creation
class InquiryCreate(InquiryBase):
    text: str = Field(min_length=MIN_LENGTH, max_length=MAX_LENGTH)


# Database model, database table inferred from class name
class Inquiry(InquiryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    text: str = Field(min_length=MIN_LENGTH, max_length=MAX_LENGTH, unique=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Properties to return via API, id is always required
class InquiryPublic(InquiryBase):
    id: uuid.UUID
    text: str
    created_at: datetime


class InquriesPublic(SQLModel):
    data: list[InquiryPublic]
    count: int
