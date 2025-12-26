from peewee import PostgresqlDatabase
from config.settings import config


database = PostgresqlDatabase(config.DATABASE_URL)
