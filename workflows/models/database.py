from urllib.parse import urlparse

from peewee import PostgresqlDatabase

from config.settings import config


def _parse_database_url(url: str) -> dict:
    """Parse PostgreSQL database URL into connection parameters."""
    parsed = urlparse(url)
    database_params = {}
    database_params["database"] = parsed.path.lstrip("/").split("?")[0]
    database_params["host"] = parsed.hostname
    database_params["port"] = parsed.port
    database_params["user"] = parsed.username
    database_params["password"] = parsed.password
    return database_params

db_params = _parse_database_url(config.DATABASE_URL)
database = PostgresqlDatabase(**db_params, autocommit=False, autorollback=True)