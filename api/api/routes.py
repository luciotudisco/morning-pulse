from flask import jsonify

from api import bp
from api.auth import get_user_id
from api.auth import requires_auth
from flask_pydantic import validate
from models.scheduled_call_dao import ScheduledCallDAO
from schema.scheduled_call import CreateScheduledCallRequest


@bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200


@bp.route("/", methods=["GET"])
def home():
    """Home page endpoint."""
    return "Hello, World!", 200


@bp.route("/scheduled_calls", methods=["GET"])
@requires_auth
def get_scheduled_calls():
    """Retrieve scheduled calls for the current logged-in user."""
    user_id = get_user_id()
    calls = ScheduledCallDAO.get_by_user_id(user_id)
    return jsonify([call.model_dump(mode="json") for call in calls]), 200


@bp.route("/scheduled_calls", methods=["POST"])
@requires_auth
@validate(body=CreateScheduledCallRequest)
def create_scheduled_call(body: CreateScheduledCallRequest):
    """Create a new scheduled call for the current logged-in user."""
    call = ScheduledCallDAO.create(
        user_id=get_user_id(),
        scheduled_time=body.scheduled_time,
        phone_number=body.phone_number,
        timezone=body.timezone,
    )
    return jsonify(call.model_dump(mode="json")), 201  