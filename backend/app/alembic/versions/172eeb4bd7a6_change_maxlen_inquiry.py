"""change maxlen inquiry

Revision ID: 172eeb4bd7a6
Revises: fda83aff7cb5
Create Date: 2024-09-25 09:23:42.456980

"""

import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from alembic import op

# revision identifiers, used by Alembic.
revision = "172eeb4bd7a6"
down_revision = "fda83aff7cb5"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "inquiry",
        "text",
        existing_type=sa.VARCHAR(length=255),
        type_=sqlmodel.sql.sqltypes.AutoString(length=256),
        existing_nullable=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "inquiry",
        "text",
        existing_type=sqlmodel.sql.sqltypes.AutoString(length=256),
        type_=sa.VARCHAR(length=255),
        existing_nullable=False,
    )
    # ### end Alembic commands ###