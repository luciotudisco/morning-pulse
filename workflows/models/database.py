from urllib.parse import urlparse

from peewee import PostgresqlDatabase

from config.settings import config


def parse_database_url(url: str) -> dict:
    """Parse PostgreSQL database URL into connection parameters."""
    parsed = urlparse(url)
    return {
        "database": parsed.path.lstrip("/").split("?")[0] or "postgres",
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 5432,
        "user": parsed.username or "postgres",
        "password": parsed.password,
    }


# Create database connection
db_params = parse_database_url(config.DATABASE_URL)
database = PostgresqlDatabase(**db_params)
