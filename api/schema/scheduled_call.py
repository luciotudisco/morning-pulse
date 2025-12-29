
from pydantic import BaseModel
from pydantic import Field


class ScheduledCall(BaseModel):
    """Pydantic model for a scheduled call."""

    id: int = Field(description="Scheduled call ID")
    schedule_pattern: str = Field(description="Schedule pattern (cron expression, e.g., '0 7 * * *' for 7 AM daily)")
    timezone: str = Field(default="UTC", description="Timezone for the scheduled time")
    phone_number: str | None = Field(default=None, description="Phone number for the call")


class CreateScheduledCallRequest(BaseModel):
    """Pydantic model for creating a scheduled call request."""

    schedule_pattern: str = Field(
        description="Schedule pattern (cron expression)"
    )
    phone_number: str = Field(pattern=r"^[\+]?[1-9]\d{1,14}$")
    timezone: str = Field(default="UTC", description="Timezone for the scheduled time")
