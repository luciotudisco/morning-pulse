from datetime import UTC
from datetime import datetime
from datetime import timezone

from croniter import croniter
from peewee import AutoField
from peewee import DateTimeField
from peewee import Model
from peewee import TextField

from models.database import database


class ScheduledCallModel(Model):
    """Peewee model representing a scheduled call."""

    class Meta:
        database = database
        table_name = "scheduled_calls"

    id = AutoField(primary_key=True)
    user_id = TextField(null=False, index=True)
    schedule_pattern = TextField(null=False)
    timezone = TextField(null=False, default="UTC")
    phone_number = TextField(null=True)
    last_executed_at = DateTimeField(null=True)
    next_executed_at = DateTimeField(null=True)
    created_at = DateTimeField(default=lambda: datetime.now(UTC), null=False)
    updated_at = DateTimeField(default=lambda: datetime.now(UTC), null=False)

    def save(self, *args, **kwargs):
        """Update updated_at timestamp and calculate next_executed_at on save."""
        self.updated_at = datetime.now(UTC)
        
        # Calculate next execution time based on schedule_pattern
        if self.schedule_pattern:
            try:
                now_utc = datetime.now(timezone.utc)
                # Create cron iterator using current UTC time
                cron = croniter(self.schedule_pattern, now_utc)
                # Get the next scheduled time
                next_time = cron.get_next(datetime)
                # Convert to UTC timezone-aware datetime
                self.next_executed_at = next_time.replace(tzinfo=timezone.utc)
            except Exception as e:
                # If cron parsing fails, log but don't fail the save
                print(f"Warning: Failed to calculate next_executed_at for schedule_pattern '{self.schedule_pattern}': {e}")
                self.next_executed_at = None
        
        return super().save(*args, **kwargs)

    def to_schema(self):
        """Convert Peewee model to Pydantic schema."""
        from schema.scheduled_call import ScheduledCall
        return ScheduledCall(
            id=self.id,
            schedule_pattern=self.schedule_pattern,
            timezone=self.timezone,
            phone_number=self.phone_number,
        )
