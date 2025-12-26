from datetime import time

from pydantic import BaseModel
from pydantic import Field


class ScheduledCall(BaseModel):
    """Pydantic model for a scheduled call."""

    scheduled_time: time = Field(description="Scheduled wake-up time")
    timezone: str = Field(default="UTC", description="Timezone for the scheduled time")
    phone_number: str | None = Field(default=None, description="Phone number for the call")
