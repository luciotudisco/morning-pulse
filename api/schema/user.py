
from pydantic import BaseModel
from pydantic import Field


class User(BaseModel):
    """Pydantic model for a user."""

    user_id: str = Field(description="User ID (Auth0 sub)")
    email: str | None = Field(default=None, description="User email address")
    name: str | None = Field(default=None, description="User full name")
    given_name: str | None = Field(default=None, description="User given name (first name)")
    family_name: str | None = Field(default=None, description="User family name (last name)")
    picture: str | None = Field(default=None, description="User profile picture URL")
    phone_number: str | None = Field(default=None, description="User phone number")

