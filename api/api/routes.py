from flask import jsonify

from api import bp
from api.auth import get_user_id
from api.auth import requires_auth
from models.scheduled_call_dao import ScheduledCallDAO


@bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200


@bp.route("/", methods=["GET"])
def home():
    """Home page endpoint."""
    return "Hello, World!", 200


@bp.route("/scheduled-calls", methods=["GET"])
@requires_auth
def get_scheduled_calls():
    """Retrieve scheduled calls for the current logged-in user."""
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "User ID not found in session"}), 401
    
    calls = ScheduledCallDAO.get_by_user_id(user_id)
    return jsonify([call.model_dump(mode="json") for call in calls]), 200  