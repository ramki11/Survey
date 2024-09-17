"""add unique constraint to question

Revision ID: 1617c0338835
Revises: 276f0948df9d
Create Date: 2024-09-14 14:24:02.495562

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '1617c0338835'
down_revision = '276f0948df9d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'inquiry', ['text'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'inquiry', type_='unique')
    # ### end Alembic commands ###