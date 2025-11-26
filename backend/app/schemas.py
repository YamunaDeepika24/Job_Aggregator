from pydantic import BaseModel, EmailStr
from typing import Optional, List

# -------------------
# USER SCHEMAS
# -------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# -------------------
# PROFILE SCHEMAS
# -------------------
# class ProfileBase(BaseModel):
#     job_category: Optional[str] = None
#     location: Optional[str] = None
#     visa_required: Optional[str] = None
#     years_experience: Optional[int] = 0


# class ProfileCreate(ProfileBase):
#     domains: Optional[List[str]] = []
#     roles: Optional[List[str]] = []
#     work_modes: Optional[List[str]] = []


# class ProfileOut(ProfileBase):
#     id: int
#     user_id: int
#     domains: List[str] = []
#     roles: List[str] = []
#     work_modes: List[str] = []

#     class Config:
#         orm_mode = True

from pydantic import BaseModel
from typing import Optional, List

class ProfileBase(BaseModel):
    job_category: Optional[str] = None
    domains: Optional[List[str]] = []
    roles: Optional[List[str]] = []
    years_experience: Optional[int] = None
    work_modes: Optional[List[str]] = []
    location: Optional[str] = None
    visa_required: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    url: str
    summary: str | None = None
    salary: str | None = None
    experience_level: str | None = None
    category: str | None = None


class JobCreate(JobBase):
    pass  # No extra fields, but required for POST input
