from ast import pattern
import re
from datetime import time

from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator


class ScheduledCall(BaseModel):
    """Pydantic model for a scheduled call."""

    scheduled_time: time = Field(description="Scheduled wake-up time")
    timezone: str = Field(default="UTC", description="Timezone for the scheduled time")
    phone_number: str | None = Field(default=None, description="Phone number for the call")


class CreateScheduledCallRequest(BaseModel):
    """Pydantic model for creating a scheduled call request."""

    scheduled_time: str = Field(pattern=r"^([01]?[0-9]|2[0-3]):([0-5][0-9])$")
    phone_number: str = Field(pattern=r"^[\+]?[1-9]\d{1,14}$")
    timezone: str = Field(default="UTC", description="Timezone for the scheduled time")
