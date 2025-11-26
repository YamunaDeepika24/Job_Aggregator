from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    profile = relationship("Profile", uselist=False, back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    job_category = Column(String, nullable=True)
    domains = Column(JSON, nullable=True)
    roles = Column(JSON, nullable=True)
    years_experience = Column(Integer, nullable=True)
    work_modes = Column(JSON, nullable=True)
    location = Column(String, nullable=True)
    visa_required = Column(String, nullable=True)
    user = relationship("User", back_populates="profile")
