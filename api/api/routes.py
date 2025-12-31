from flask import jsonify
from flask_pydantic import validate

from api import bp
from api.auth import get_user_info
from api.auth import requires_auth
from models.scheduled_call_dao import ScheduledCallDAO
from schema.scheduled_call import CreateScheduledCallRequest
from schema.scheduled_call import UpdateScheduledCallRequest


@bp.route("/auth/me", methods=["GET"])
@requires_auth
def me():
    """Get current user information."""
    user = get_user_info()
    return jsonify(user.model_dump(mode="json")), 200


@bp.route("/scheduled_calls", methods=["GET"])
@requires_auth
def get_scheduled_calls():
    """Retrieve scheduled calls for the current logged-in user."""
    user_id = get_user_info().user_id
    calls = ScheduledCallDAO.get_by_user_id(user_id)
    return jsonify([call.model_dump(mode="json") for call in calls]), 200


@bp.route("/scheduled_calls", methods=["POST"])
@requires_auth
@validate(body=CreateScheduledCallRequest)
def create_scheduled_call(body: CreateScheduledCallRequest):
    """Create a new scheduled call for the current logged-in user."""
    call = ScheduledCallDAO.create(
        user_id=get_user_info().user_id,
        schedule_pattern=body.schedule_pattern,
        phone_number=body.phone_number,
    )
    return jsonify(call.model_dump(mode="json")), 201


@bp.route("/scheduled_calls/<int:call_id>", methods=["PUT"])
@requires_auth
@validate(body=UpdateScheduledCallRequest)
def update_scheduled_call(call_id: int, body: UpdateScheduledCallRequest):
    """Update an existing scheduled call for the current logged-in user."""
    user_id = get_user_info().user_id
    call = ScheduledCallDAO.get_by_id_and_user_id(call_id, user_id)
    if not call:
        return jsonify({"error": "Scheduled call not found"}), 404
    call.schedule_pattern = body.schedule_pattern
    call.phone_number = body.phone_number
    return jsonify(call.model_dump(mode="json")), 200


@bp.route("/scheduled_calls/<int:call_id>", methods=["DELETE"])
@requires_auth
def delete_scheduled_call(call_id: int):
    """Delete a scheduled call for the current logged-in user."""
    user_id = get_user_info().user_id
    call = ScheduledCallDAO.get_by_id_and_user_id(call_id, user_id)
    if not call:
        return jsonify({"error": "Scheduled call not found"}), 404
    ScheduledCallDAO.delete(call_id)
    return jsonify({"message": "Scheduled call deleted successfully"}), 200
