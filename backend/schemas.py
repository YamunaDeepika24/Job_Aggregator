# # backend/schemas.py
# from pydantic import BaseModel, EmailStr, Field
# from typing import List, Optional

# from pydantic import BaseModel, EmailStr
# from typing import List, Optional

# class UserCreate(BaseModel):
#     email: EmailStr
#     password: str
#     name: Optional[str]  # single string from frontend

# class UserOut(BaseModel):
#     id: int
#     email: EmailStr
#     name: List[str]  # match DB
#     is_active: bool

#     class Config:
#         orm_mode = True


# class Token(BaseModel):
#     access_token: str
#     token_type: str = "bearer"

# class TokenData(BaseModel):
#     sub: Optional[str] = None

# class LoginIn(BaseModel):
#     email: EmailStr
#     password: str

# class PreferenceIn(BaseModel):
#     domains: Optional[List[str]] = Field(default_factory=list)
#     roles: Optional[List[str]] = Field(default_factory=list)
#     locations: Optional[List[str]] = Field(default_factory=list)
#     experience: Optional[int] = None
#     work_mode: Optional[str] = None
#     visa_sponsorship: Optional[str] = None
#     email_opt_in: Optional[bool] = True

# class PreferenceOut(PreferenceIn):
#     id: int
#     user_id: int

#     class Config:
#         orm_mode = True
from pydantic import BaseModel, EmailStr
from typing import Optional

# Registration input
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# Login input
class LoginForm(BaseModel):
    email: EmailStr
    password: str

# Output user data (without password)
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True

# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional

class UserPreferencesIn(BaseModel):
    domains: Optional[List[str]]
    roles: Optional[List[str]]
    experience: Optional[int]
    work_mode: Optional[str]
    locations: Optional[List[str]]
    visa_sponsorship: Optional[str]
    email_opt_in: Optional[bool] = True

class UserPreferencesOut(UserPreferencesIn):
    id: int
    user_id: int

    class Config:
        orm_mode = True
