from celery import Celery

from config.settings import config

app = Celery("morning-pulse-workflows", broker=config.REDIS_URL, backend=config.REDIS_URL)

# Configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "hello-world-every-5-minutes": {
            "task": "tasks.hello_world",
            "schedule": 300.0,  # Run every 5 minutes (300 seconds)
        },
    },
)

