import os

from celery import Celery

# Get Redis URL from environment (Heroku sets REDIS_URL)
redis_url = os.getenv("REDISCLOUD_URL", "redis://localhost:6379/0")

# Create Celery app
app = Celery(
    "morning-pulse-workflows",
    broker=redis_url,
    backend=redis_url,
)

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


@app.task(name="tasks.hello_world")
def hello_world() -> str:
    """Dummy task that prints hello world."""
    message = "Hello World!"
    print(message)
    return message
