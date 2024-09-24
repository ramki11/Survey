# This app injects an in-memory database for testing https://fastapi.tiangolo.com/advanced/testing-database/#file-structure
# Because some Sessions call "exec()", they have to use sqlmodel rather than sqlalchemy https://github.com/fastapi/sqlmodel/issues/75#issuecomment-2109911909
# Sqlmodel represents UUIDs as hex but sqlalchemy represents them as plain strings.
# get_current_user seems to employ sqlalchemy instead of sqlmodel so we might need to mock that for future tests.

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.api.deps import get_db
from app.core.config import settings
from app.core.db import init_db
from app.main import app
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers


@pytest.fixture(name="db", scope="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client", scope="session")
def client_fixture(db: Session):
    def get_db_override():
        return db

    app.dependency_overrides[get_db] = get_db_override
    init_db(db)
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# @pytest.fixture(scope="module")
# def client() -> Generator[TestClient, None, None]:
#     with TestClient(app) as c:
#         yield c
#

#
# engine = create_engine(
#     "sqlite:///:memory:",
#     connect_args={"check_same_thread": False},
#     poolclass=StaticPool,
# )
#
# TestingSessionLocal = sessionmaker(
#     class_=Session, autocommit=False, autoflush=False, bind=engine
# )
# SQLModel.metadata.create_all(engine)
#
#
# def override_get_db() -> Generator[Session, None, None]:
#     try:
#         db = TestingSessionLocal()
#         yield db
#     finally:
#         db.close()
#
#
# app.dependency_overrides[get_db] = override_get_db
#
#
# @pytest.fixture(scope="session", autouse=True)
# def db() -> Generator[Session, None, None]:
#     with Session(engine) as session:
#         init_db(session)
#         yield session
#         statement = delete(Item)
#         session.execute(statement)
#         statement = delete(User)
#         session.execute(statement)
#         session.commit()


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient, db: Session) -> dict[str, str]:
    return authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
