from functools import wraps

from flask import jsonify
from flask import redirect
from flask import session
from flask import url_for

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


