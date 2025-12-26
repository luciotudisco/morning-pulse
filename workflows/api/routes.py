from flask import jsonify

from api import bp
from models.database import database
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
    try:
        # Ensure database connection is open (with retry for closed connections)
        if database.is_closed():
            database.connect(reuse_if_open=True)
        
        # Query all scheduled calls
        calls = list(ScheduledCall.select())
        
        # Convert to list of dictionaries
        result = [call.to_dict() for call in calls]
        
        return jsonify(result), 200
    except Exception as e:
        # Try to reconnect if connection error
        try:
            if database.is_closed():
                database.connect(reuse_if_open=True)
                calls = list(ScheduledCall.select())
                result = [call.to_dict() for call in calls]
                return jsonify(result), 200
        except Exception:
            pass
        return jsonify({"error": str(e)}), 500