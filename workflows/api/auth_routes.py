from flask import current_app
from flask import redirect
from flask import session
from flask import url_for

from api import bp
from api.auth import get_user_info
from api.auth import requires_auth


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
    resp = auth0.get("userinfo")
    userinfo = resp.json()

    session["jwt_payload"] = token
    session["profile"] = {
        "user_id": userinfo["sub"],
        "name": userinfo["name"],
        "picture": userinfo["picture"],
        "email": userinfo["email"],
    }
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


@bp.route("/profile")
@requires_auth
def profile():
    """Get user profile (protected route)."""
    from flask import jsonify

    return jsonify(get_user_info()), 200

