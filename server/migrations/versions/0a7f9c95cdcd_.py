"""empty message

Revision ID: 0a7f9c95cdcd
Revises: 4907c596c00f
Create Date: 2019-12-03 02:45:11.426164

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0a7f9c95cdcd'
down_revision = '4907c596c00f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('owner_name_uc', 'email_templates', ['owner', 'name'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('owner_name_uc', 'email_templates', type_='unique')
    # ### end Alembic commands ###
