from collections.abc import Generator

from sqlmodel import Session

from app.backend_pre_start import engine


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
