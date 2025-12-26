import os


class Config:
    """Base configuration."""

    REDIS_URL = os.getenv("REDISCLOUD_URL", "redis://localhost:6379/0")
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/morning_pulse")
    PORT = int(os.getenv("PORT", 5000))
    SECRET_KEY = os.getenv("APP_SECRET_KEY", "dev-secret-key-change-in-production")
    
    # Auth0 Configuration
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
    AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "")
    AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET", "")


config = Config()

