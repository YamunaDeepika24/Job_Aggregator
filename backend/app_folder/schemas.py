from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PreferenceUpdate(BaseModel):
    domain: str | None = None
    role: str | None = None
    experience: int | None = None
    location: str | None = None
    visa_sponsorship: bool | None = None
    work_mode: str | None = None

class PreferenceOut(PreferenceUpdate):
    class Config:
        orm_mode = True
