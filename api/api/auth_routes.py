from flask import current_app
from flask import jsonify
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
    # Fetch and persist userinfo so subsequent requests (e.g. /auth/me) can return a stable user shape.
    try:
        userinfo_response = auth0.get("userinfo", token=token)
        if userinfo_response.ok:
            token["userinfo"] = userinfo_response.json()
    except Exception:
        # If userinfo fetch fails, keep the session token; /auth/me can attempt again.
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
    auth0 = get_auth0()
    token = session.get("user", {}) or {}

    userinfo = token.get("userinfo")
    if not isinstance(userinfo, dict) or not userinfo:
        # Best-effort: fetch userinfo at request time if callback didn't persist it.
        try:
            userinfo_response = auth0.get("userinfo", token=token)
            if userinfo_response.ok:
                userinfo = userinfo_response.json()
                token["userinfo"] = userinfo
                session["user"] = token
        except Exception:
            userinfo = {}

    user = AuthenticatedUser(
        sub=userinfo.get("sub") if isinstance(userinfo, dict) else None,
        name=userinfo.get("name") if isinstance(userinfo, dict) else None,
        nickname=userinfo.get("nickname") if isinstance(userinfo, dict) else None,
        given_name=userinfo.get("given_name") if isinstance(userinfo, dict) else None,
        family_name=userinfo.get("family_name") if isinstance(userinfo, dict) else None,
        email=userinfo.get("email") if isinstance(userinfo, dict) else None,
        email_verified=userinfo.get("email_verified") if isinstance(userinfo, dict) else None,
        picture=userinfo.get("picture") if isinstance(userinfo, dict) else None,
        updated_at=userinfo.get("updated_at") if isinstance(userinfo, dict) else None,
    )
    return jsonify(user.model_dump(mode="json")), 200