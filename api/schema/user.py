from pydantic import BaseModel
from pydantic import Field


class AuthenticatedUser(BaseModel):
    """Pydantic model representing the currently authenticated user (Auth0 OIDC userinfo)."""

    sub: str | None = Field(default=None, description="Auth0 user identifier (OIDC subject)")
    name: str | None = Field(default=None, description="Full name")
    nickname: str | None = Field(default=None, description="Nickname / username")
    given_name: str | None = Field(default=None, description="Given name")
    family_name: str | None = Field(default=None, description="Family name")
    email: str | None = Field(default=None, description="Email address")
    email_verified: bool | None = Field(default=None, description="Whether email is verified")
    picture: str | None = Field(default=None, description="Profile picture URL")
    updated_at: str | None = Field(default=None, description="Last profile update timestamp")

