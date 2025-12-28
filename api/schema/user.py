from pydantic import BaseModel
from pydantic import Field


class AuthenticatedUser(BaseModel):
    """Pydantic model representing the currently authenticated user (Auth0 userinfo)."""

    sub: str = Field(description="Auth0 user identifier (subject)")
    email: str | None = Field(default=None, description="User email")
    email_verified: bool | None = Field(default=None, description="Whether the email is verified")
    name: str | None = Field(default=None, description="Display name")
    nickname: str | None = Field(default=None, description="Nickname/handle")
    picture: str | None = Field(default=None, description="Profile picture URL")
    given_name: str | None = Field(default=None, description="Given name")
    family_name: str | None = Field(default=None, description="Family name")
    updated_at: str | None = Field(default=None, description="Last updated timestamp (as provided by IdP)")
