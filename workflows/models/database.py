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
database = PostgresqlDatabase(**db_params, autocommit=False, autorollback=True)


def init_db():
    """Initialize database connection and create tables."""
    try:
        database.connect(reuse_if_open=True)
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
    finally:
        # Don't close here - keep connection open for requests
        pass


def close_db():
    """Close database connection."""
    if not database.is_closed():
        database.close()
