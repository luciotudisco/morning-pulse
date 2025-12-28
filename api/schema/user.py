from pydantic import BaseModel
from pydantic import Field
from typing import Optional

class User(BaseModel):
    """Pydantic model for a user."""

    user_id: str = Field(description="User ID (Auth0 sub)")
    email: Optional[str] = Field(default=None, description="User email address")
    name: Optional[str] = Field(default=None, description="User full name")
    given_name: Optional[str] = Field(default=None, description="User given name (first name)")
    family_name: Optional[str] = Field(default=None, description="User family name (last name)")
    picture: Optional[str] = Field(default=None, description="User profile picture URL")
    phone_number: Optional[str] = Field(default=None, description="User phone number")

