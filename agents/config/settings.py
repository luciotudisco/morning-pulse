import os


class Config:
    """Base configuration."""

    ENV_FILE = os.getenv("ENV_FILE", ".env.local")


config = Config()

