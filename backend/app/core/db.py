import logging

from sqlmodel import Session, create_engine, select

from app.core.config import settings
from app.models import User, UserCreate
from app.services import users

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    superuser = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not superuser:
        superuser_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        superuser = users.create_user(session=session, user_create=superuser_in)

    user = session.exec(
        select(User).where(User.email == settings.EMAIL_TEST_USER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.EMAIL_TEST_USER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=False,
        )
        user = users.create_user(session=session, user_create=user_in)


def whitelist_email(session: Session, email: str, is_superuser: bool = False) -> None:
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            user_in = UserCreate(
                email=email,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                is_superuser=is_superuser,
            )
            users.create_user(session=session, user_create=user_in)
            logger.info(f"{email} whitelisted.")
        else:
            logger.info(f"{email} already whitelisted.")
