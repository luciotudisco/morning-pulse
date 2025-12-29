from functools import wraps

from authlib.integrations.flask_client import OAuth
from flask import jsonify
from flask import session

from schema.user import User


def init_auth(app):
    """Initialize Auth0 OAuth."""
    oauth = OAuth(app)
    return oauth.register(
        "auth0",
        client_id=app.config["AUTH0_CLIENT_ID"],
        client_secret=app.config["AUTH0_CLIENT_SECRET"],
        client_kwargs={"scope": "openid profile email"},
        server_metadata_url=f'https://{app.config["AUTH0_DOMAIN"]}/.well-known/openid-configuration',
    )


def requires_auth(f):
    """Decorator to require authentication for a route."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated


def get_user_info() -> User | None:
    """Get the current user's information from the session."""
    if "user" not in session:
        return None
    user_data = session.get("user", {})
    userinfo = user_data.get("userinfo", {})
    return User(
        user_id=userinfo.get('sub'),
        email=userinfo.get("email"),
        name=userinfo.get("name"),
        given_name=userinfo.get("given_name"),
        family_name=userinfo.get("family_name"),
        picture=userinfo.get("picture"),
    )


