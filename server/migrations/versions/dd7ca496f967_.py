"""empty message

Revision ID: dd7ca496f967
Revises: 9045474be291
Create Date: 2019-12-04 12:14:01.765929

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dd7ca496f967'
down_revision = '9045474be291'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('email_templates_step_id_fkey', 'email_templates', type_='foreignkey')
    op.drop_column('email_templates', 'step_id')
    op.add_column('steps', sa.Column('email_template_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'steps', 'email_templates', ['email_template_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'steps', type_='foreignkey')
    op.drop_column('steps', 'email_template_id')
    op.add_column('email_templates', sa.Column('step_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('email_templates_step_id_fkey', 'email_templates', 'steps', ['step_id'], ['id'])
    # ### end Alembic commands ###