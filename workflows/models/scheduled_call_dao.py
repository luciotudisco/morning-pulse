from datetime import time

from models.scheduled_call import ScheduledCallModel
from schema.scheduled_call import ScheduledCall


class ScheduledCallDAO:
    """Data Access Object for ScheduledCall operations."""

    @staticmethod
    def create(user_id: str, scheduled_time: time, phone_number: str, timezone: str = "UTC") -> ScheduledCall:
        """Create a new scheduled call."""
        return ScheduledCallModel.create(
                user_id=user_id,
                scheduled_time=scheduled_time,
                timezone=timezone,
                phone_number=phone_number,

    @staticmethod
    def get_by_id(call_id: int) -> ScheduledCall | None:
        """Get a scheduled call by ID."""
        return ScheduledCallModel.get_by_id(call_id)

    @staticmethod
    def get_all() -> List[ScheduledCall]:
        """Get all scheduled calls."""
        calls = ScheduledCallModel.select()
        return [call.to_schema() for call in calls]

    @staticmethod
    def get_by_user_id(user_id: str) -> List[ScheduledCall]:
        """Get all scheduled calls for a specific user."""
        calls = ScheduledCallModel.select().where(ScheduledCallModel.user_id == user_id)
        return [call.to_schema() for call in calls]

    @staticmethod
    def delete(call_id: int) -> bool:
        """Delete a scheduled call."""
        call = ScheduledCallModel.get_by_id(call_id)
        call.delete_instance()