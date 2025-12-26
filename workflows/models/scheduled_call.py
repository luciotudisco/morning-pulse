from datetime import datetime
from datetime import timezone

from peewee import AutoField
from peewee import DateTimeField
from peewee import Model
from peewee import TextField
from peewee import TimeField

from models.database import database


class ScheduledCallModel(Model):
    """Peewee model representing a scheduled call."""

    class Meta:
        database = database
        table_name = "scheduled_calls"

    id = AutoField(primary_key=True)
    user_id = TextField(null=False, index=True)
    scheduled_time = TimeField(null=False)
    timezone = TextField(null=False, default="UTC")
    phone_number = TextField(null=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc), null=False)
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc), null=False)

    def save(self, *args, **kwargs):
        """Update updated_at timestamp on save."""
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)

    def to_schema(self):
        """Convert Peewee model to Pydantic schema."""
        from schema.scheduled_call import ScheduledCall
        return ScheduledCall(
            scheduled_time=self.scheduled_time,
            timezone=self.timezone,
            phone_number=self.phone_number,
        )
