import uuid
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from .inquiry import Inquiry


class Response(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str = Field(min_length=1, max_length=255)
    inquiry_id: uuid.UUID = Field(foreign_key="inquiry.id")
    inquiry: Optional[Inquiry] = Relationship(back_populates="responses")
