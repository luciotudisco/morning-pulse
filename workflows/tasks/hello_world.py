from tasks.celery_app import app  # noqa: F401


@app.task(name="tasks.hello_world")
def hello_world() -> None:
    """Dummy task that prints hello world."""
    print("Hello World!")

