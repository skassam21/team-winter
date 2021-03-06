"""empty message

Revision ID: ae2b6d066728
Revises: 
Create Date: 2019-12-13 15:56:11.491619

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ae2b6d066728'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('first_name', sa.String(length=120), nullable=True),
    sa.Column('last_name', sa.String(length=120), nullable=True),
    sa.Column('password', sa.String(length=120), nullable=False),
    sa.Column('gmail_credentials', sa.JSON(), nullable=True),
    sa.Column('gmail_address', sa.String(length=120), nullable=True),
    sa.Column('gmail_auth_state', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('campaigns',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=True),
    sa.Column('creation_date', sa.DateTime(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('prospects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=True),
    sa.Column('status', sa.String(length=120), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('imported_from', sa.String(length=120), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('templates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=True),
    sa.Column('type', sa.String(length=120), nullable=True),
    sa.Column('subject', sa.String(length=120), nullable=True),
    sa.Column('body', sa.VARCHAR(length=500), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.CheckConstraint('char_length(name) > 0', name='name_min_length'),
    sa.CheckConstraint('char_length(subject) > 0', name='subject_min_length'),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('thread_tasks',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('complete', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('campaigns_prospects',
    sa.Column('campaign_id', sa.Integer(), nullable=True),
    sa.Column('prospect_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ),
    sa.ForeignKeyConstraint(['prospect_id'], ['prospects.id'], )
    )
    op.create_table('prospects_tags',
    sa.Column('prospect_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['prospect_id'], ['prospects.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], )
    )
    op.create_table('steps',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('campaign_id', sa.Integer(), nullable=True),
    sa.Column('template_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ),
    sa.ForeignKeyConstraint(['template_id'], ['templates.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('threads',
    sa.Column('id', sa.String(length=16), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('campaign_id', sa.Integer(), nullable=True),
    sa.Column('replied_to', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('email_tasks',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('step_id', sa.Integer(), nullable=False),
    sa.Column('prospect_email', sa.String(length=120), nullable=False),
    sa.Column('subject', sa.String(length=120), nullable=False),
    sa.Column('body', sa.VARCHAR(length=2000), nullable=False),
    sa.Column('complete', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['step_id'], ['steps.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('steps_prospects',
    sa.Column('step_id', sa.Integer(), nullable=True),
    sa.Column('prospect_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['prospect_id'], ['prospects.id'], ),
    sa.ForeignKeyConstraint(['step_id'], ['steps.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('steps_prospects')
    op.drop_table('email_tasks')
    op.drop_table('threads')
    op.drop_table('steps')
    op.drop_table('prospects_tags')
    op.drop_table('campaigns_prospects')
    op.drop_table('thread_tasks')
    op.drop_table('templates')
    op.drop_table('prospects')
    op.drop_table('campaigns')
    op.drop_table('users')
    op.drop_table('tags')
    # ### end Alembic commands ###
