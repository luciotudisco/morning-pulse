from flask import jsonify

from api import bp
from models.scheduled_call import ScheduledCall


@bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200


@bp.route("/", methods=["GET"])
def home():
    """Home page endpoint."""
    return "Hello, World!", 200


@bp.route("/scheduled-calls", methods=["GET"])
def get_scheduled_calls():
    """Retrieve all scheduled calls."""
    return jsonify([call.to_dict() for call in ScheduledCall.select()]), 200