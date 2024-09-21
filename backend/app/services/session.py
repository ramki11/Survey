from sqlmodel import Session

from app.backend_pre_start import engine


def get_session():
    with Session(engine) as session:
        yield session
