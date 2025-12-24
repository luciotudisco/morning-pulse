from mem0 import AsyncMemoryClient


class Memory:
    _instance: AsyncMemoryClient | None = None
    _lock = None

    @classmethod
    def _get_instance(cls) -> AsyncMemoryClient:
        """Get or create the singleton instance of AsyncMemoryClient."""
        if cls._instance is None:
            cls._instance = AsyncMemoryClient()
        return cls._instance

    @classmethod
    async def add_user_memory(cls, message: str) -> None:
        await cls._get_instance().add(message, user_id=1)
