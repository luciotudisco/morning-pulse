from functools import wraps

from flask import jsonify
from flask import session

from authlib.integrations.flask_client import OAuth


def init_auth(app):
    """Initialize Auth0 OAuth."""
    oauth = OAuth(app)
    auth0 = oauth.register(
        "auth0",
        client_id=app.config["AUTH0_CLIENT_ID"],
        client_secret=app.config["AUTH0_CLIENT_SECRET"],
        client_kwargs={"scope": "openid profile email"},
        server_metadata_url=f'https://{app.config["AUTH0_DOMAIN"]}/.well-known/openid-configuration',
    )
    return auth0


def requires_auth(f):
    """Decorator to require authentication for a route."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated


def get_user_id() -> str | None:
    """Get the current user's ID from the session."""
    if "user" not in session:
        return None
    user_data = session.get("user", {})
    # Try to get user ID from userinfo first, then from token sub
    userinfo = user_data.get("userinfo", {})
    if isinstance(userinfo, dict) and "sub" in userinfo:
        return userinfo.get("sub")
    # Fallback to token sub field
    return user_data.get("sub")


