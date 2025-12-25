import os

from celery import Celery

redis_url = os.getenv("REDISCLOUD_URL", "redis://localhost:6379/0")
app = Celery("morning-pulse-workflows", broker=redis_url, backend=redis_url)

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
            "schedule": 5.0,  # Run every 5 minutes (300 seconds)
        },
    },
)


@app.task(name="tasks.hello_world")
def hello_world() -> None:
    print("Hello World!")
