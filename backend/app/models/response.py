import uuid
from datetime import datetime, timezone

from backend.app.models.inquiry import Inquiry
from sqlmodel import Field, Relationship, SQLModel


class ResponseBase(SQLModel):
    text: str = Field(min_length=10, max_length=255)


class ResponseCreate(ResponseBase):
    text: str = Field(min_length=10, max_length=255)


class Response(ResponseBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    text: str = Field(min_length=10, max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    inquiry_id: uuid.UUID = Field(foreign_key="inquiry.id")
    inquiry: Inquiry = Relationship(back_populates="responses")
