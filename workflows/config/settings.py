import os


class Config:
    """Base configuration."""

    REDIS_URL = os.getenv("REDISCLOUD_URL", "redis://localhost:6379/0")
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/morning_pulse")
    PORT = int(os.getenv("PORT", 5000))


config = Config()

