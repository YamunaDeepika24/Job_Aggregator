from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # NEW — connect user to preferences
    preferences = relationship("UserPreferences", back_populates="user", uselist=False)


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Arrays stored as comma-separated strings in DB
    domains = Column(ARRAY(String), default=[])
    roles = Column(ARRAY(String), default=[])
    locations = Column(ARRAY(String), default=[])

    # Simple fields
    experience = Column(Integer, nullable=True)
    work_mode = Column(ARRAY(String), default=[])
    visa_sponsorship = Column(String, nullable=True)
    email_opt_in = Column(Boolean, default=True)

    # Relationship back to the User
    user = relationship("User", back_populates="preferences")


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    domains = Column(String)
    role = Column(String)
    location = Column(String)
    experience = Column(Integer)
    work_mode = Column(String)
    visa_sponsorship = Column(String)
