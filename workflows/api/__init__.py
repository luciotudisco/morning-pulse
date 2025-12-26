"""API routes and endpoints."""

from flask import Blueprint

bp = Blueprint("api", __name__)

from api import routes  # noqa: E402, F401
