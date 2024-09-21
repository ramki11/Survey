import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Response(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str = Field(min_length=1, max_length=255)
    inquiry_id: uuid.UUID = Field(foreign_key="inquiry.id")
    inquiry: Optional["Inquiry"] = Relationship(back_populates="responses")


# Shared properties
class InquiryBase(SQLModel):
    text: str = Field(min_length=10, max_length=255)


class InquiryCreate(InquiryBase):
    text: str = Field(min_length=10, max_length=255)


class Inquiry(InquiryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    text: str = Field(min_length=10, max_length=255, unique=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    responses: List[Response] = Relationship(back_populates="inquiry")


class InquiryPublic(InquiryBase):
    id: uuid.UUID
    text: str
    created_at: datetime


class InquriesPublic(SQLModel):
    data: list[InquiryPublic]
    count: int
