from celery import Celery
from celery.signals import task_postrun
from celery.signals import task_prerun

from config.settings import config
from models.database import database

app = Celery("morning-pulse-workflows", broker=config.REDIS_URL, backend=config.REDIS_URL)

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "process-scheduled-calls-every-minute": {
            "task": "tasks.process_scheduled_calls",
            "schedule": 60.0,  # Run every minute (60 seconds)
        },
    },
)


@task_prerun.connect
def task_prerun_handler(sender=None, task_id=None, task=None, args=None, kwargs=None, **kwds):
    """Open database connection before task execution."""
    if database.is_closed():
        database.connect(reuse_if_open=True)


@task_postrun.connect
def task_postrun_handler(sender=None, task_id=None, task=None, args=None, kwargs=None, retval=None, state=None, **kwds):
    """Close database connection after task execution."""
    if not database.is_closed():
        database.close()

