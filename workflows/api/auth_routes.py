from flask import current_app
from flask import redirect
from flask import session
from flask import url_for

from api import bp


def get_auth0():
    """Get Auth0 client from app context."""
    return current_app.extensions.get("auth0")


@bp.route("/login")
def login():
    """Initiate Auth0 login."""
    auth0 = get_auth0()
    return auth0.authorize_redirect(redirect_uri=url_for("api.callback", _external=True))


@bp.route("/callback")
def callback():
    """Handle Auth0 callback."""
    auth0 = get_auth0()
    token = auth0.authorize_access_token()
    session["user"] = token
    return redirect("/")


@bp.route("/logout")
def logout():
    """Logout and clear session."""
    auth0 = get_auth0()
    session.clear()
    params = {
        "returnTo": url_for("api.health", _external=True),
        "client_id": auth0.client_id,
    }
    domain = current_app.config["AUTH0_DOMAIN"]
    return redirect(
        f"https://{domain}/v2/logout?" + "&".join([f"{k}={v}" for k, v in params.items()])
    )

    https://morning-pulse.eu.auth0.com/authorize?redirect_uri=https%3A%2F%2Fmorning-pulse-workflows-20e81fdff6d5.herokuapp.com%2Fcallback&scope=openid+profile+email&state=F8F9pNIwyvgv5hXF3mISrfcaSkEibw&nonce=L4raOvRaWAXQzvxUqlSL