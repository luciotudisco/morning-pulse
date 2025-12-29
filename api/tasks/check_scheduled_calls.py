from datetime import datetime
from datetime import timezone

from croniter import croniter

from models.scheduled_call import ScheduledCallModel
from tasks.celery_app import app

EXECUTION_WINDOW_SECONDS = 60


def should_call_run(call: ScheduledCallModel) -> bool:
    now = datetime.now(timezone.utc)

    cron = croniter(call.schedule_pattern, now)
    prev_time = cron.get_prev(datetime)
    time_since_prev = (now - prev_time).total_seconds()

    if time_since_prev < 0:
        return False
    
    if time_since_prev >= EXECUTION_WINDOW_SECONDS:
        return False

    return call.last_run_at is None or call.last_run_at < prev_time


def process_scheduled_call(call: ScheduledCallModel) -> dict | None:
    """Process a single scheduled call."""
    should_run = should_call_run(call)
    if not should_run:
        return None
        
    now_utc = datetime.now(timezone.utc)
    call.last_executed_at = now_utc
    call.save()
        
    print(f"Scheduled call {call.id} for user {call.user_id} is due!")


@app.task(name="tasks.process_scheduled_calls")
def process_scheduled_calls() -> None:
    """
    Process all scheduled calls.
    """
    all_calls = ScheduledCallModel.select()    
    for call in all_calls:
        process_scheduled_call(call)

