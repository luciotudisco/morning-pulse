
from models.scheduled_call import ScheduledCallModel
from schema.scheduled_call import ScheduledCall


class ScheduledCallDAO:
    """Data Access Object for ScheduledCall operations."""

    @staticmethod
    def create(user_id: str, schedule_pattern: str, phone_number: str) -> ScheduledCall:
        """Create a new scheduled call."""
        model = ScheduledCallModel.create(
            user_id=user_id,
            schedule_pattern=schedule_pattern,
            phone_number=phone_number,
        )
        return model.to_schema()

    @staticmethod
    def delete(call_id: int) -> None:
        """Delete a scheduled call."""
        ScheduledCallModel.delete_by_id(call_id)

    @staticmethod
    def get_all() -> list[ScheduledCall]:
        """Get all scheduled calls."""
        calls = ScheduledCallModel.select()
        return [call.to_schema() for call in calls]

    @staticmethod
    def get_by_id(call_id: int) -> ScheduledCall | None:
        """Get a scheduled call by ID."""
        model = ScheduledCallModel.get_by_id(call_id)
        return model.to_schema()

    @staticmethod
    def get_by_id_and_user_id(call_id: int, user_id: str) -> ScheduledCall | None:
        """Get a scheduled call by ID and user ID."""
        try:
            model = ScheduledCallModel.get(
                ScheduledCallModel.id == call_id,
                ScheduledCallModel.user_id == user_id
            )
            return model.to_schema()
        except ScheduledCallModel.DoesNotExist:
            return None

    @staticmethod
    def get_by_user_id(user_id: str) -> list[ScheduledCall]:
        """Get all scheduled calls for a specific user."""
        calls = ScheduledCallModel.select().where(ScheduledCallModel.user_id == user_id)
        return [call.to_schema() for call in calls]

    @staticmethod
    def update(
        call_id: int,
        user_id: str,
        schedule_pattern: str,
        phone_number: str,
    ) -> ScheduledCall | None:
        """Update a scheduled call."""
        try:
            model = ScheduledCallModel.get(
                ScheduledCallModel.id == call_id,
                ScheduledCallModel.user_id == user_id,
            )
            model.schedule_pattern = schedule_pattern
            model.phone_number = phone_number
            model.save()
            return model.to_schema()
        except ScheduledCallModel.DoesNotExist:
            return None
