from flask import jsonify
from flask import current_app
from flask import redirect
from flask import session
from flask import url_for

from api import bp
from api.auth import requires_auth
from schema.user import AuthenticatedUser


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
    # Persist userinfo in the session so other endpoints (like /auth/me) can
    # return the authenticated user without exposing tokens.
    try:
        userinfo = auth0.get("userinfo").json()
        if isinstance(userinfo, dict):
            token["userinfo"] = userinfo
    except Exception:
        # If fetching userinfo fails for any reason, keep the token as-is.
        pass
    session["user"] = token
    return redirect("/")


@bp.route("/logout")
def logout():
    """Logout and clear session."""
    auth0 = get_auth0()
    session.clear()
    return_to_url = url_for("api.home", _external=True)
    params = {"returnTo": return_to_url, "client_id": auth0.client_id}  
    domain = current_app.config["AUTH0_DOMAIN"]
    logout_url = f"https://{domain}/v2/logout?" + "&".join([f"{k}={v}" for k, v in params.items()])
    return redirect(logout_url)


@bp.route("/auth/me", methods=["GET"])
@requires_auth
def me():
    """Return the currently authenticated user."""
    token = session.get("user") or {}
    userinfo = token.get("userinfo") if isinstance(token, dict) else {}
    if not isinstance(userinfo, dict):
        userinfo = {}

    sub = userinfo.get("sub") or (token.get("sub") if isinstance(token, dict) else None)
    if not sub:
        return jsonify({"error": "Authenticated user missing subject"}), 401

    user = AuthenticatedUser(
        sub=sub,
        email=userinfo.get("email"),
        email_verified=userinfo.get("email_verified"),
        name=userinfo.get("name"),
        nickname=userinfo.get("nickname"),
        picture=userinfo.get("picture"),
        given_name=userinfo.get("given_name"),
        family_name=userinfo.get("family_name"),
        updated_at=userinfo.get("updated_at"),
    )
    return jsonify(user.model_dump(mode="json", exclude_none=True)), 200