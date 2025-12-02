# # # backend/routers/auth_router.py
# # from fastapi import APIRouter, Depends, HTTPException
# # from sqlalchemy.orm import Session
# # from backend import crud, schemas, models
# # from backend.database import get_db
# # from backend.auth_utils import create_access_token
# # from passlib.context import CryptContext
# # router = APIRouter(prefix="", tags=["auth"])

# # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # def get_password_hash(password):
# #     return pwd_context.hash(password)

# # @router.post("/register", response_model=schemas.UserOut)
# # def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
# #     # Check if user already exists
# #     db_user = crud.get_user_by_email(db, user.email)
# #     if db_user:
# #         raise HTTPException(status_code=400, detail="Email already registered")

# #     # <-- Add this here to create the user with name as array
# #     new_user = models.User(
# #         email=user.email,
# #         name=[user.name] if user.name else [],  # <-- THIS LINE
# #         hashed_password=get_password_hash(user.password),
# #         is_active=True
# #     )

# #     db.add(new_user)
# #     db.commit()
# #     db.refresh(new_user)
# #     return new_user


# # @router.post("/login", response_model=schemas.Token)
# # def login_user(credentials: schemas.LoginIn, db: Session = Depends(get_db)):
# #     user = crud.authenticate_user(db, credentials.email, credentials.password)
# #     if not user:
# #         raise HTTPException(status_code=401, detail="Invalid credentials")
# #     token = create_access_token({"sub": user.email})
# #     return {"access_token": token, "token_type": "bearer"}
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from backend import crud, models, schemas, auth_utils
# from backend.database import get_db

# router = APIRouter(prefix="/api/auth")

# # Register
# @router.post("/register", response_model=schemas.UserOut)
# def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     hashed = auth_utils.get_password_hash(user.password)
#     new_user = models.User(
#         email=user.email,
#         name=[user.name],  # store as array
#         hashed_password=hashed,
#         is_active=True
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user

# # Login
# @router.post("/login")
# def login_user(credentials: schemas.LoginForm, db: Session = Depends(get_db)):
#     user = crud.get_user_by_email(db, credentials.email)
#     if not user or not auth_utils.verify_password(credentials.password, user.hashed_password):
#         raise HTTPException(status_code=400, detail="Invalid credentials")
#     access_token = auth_utils.create_access_token({"sub": str(user.id)})
#     return {"access_token": access_token, "token_type": "bearer"}

# backend/routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import crud, models, schemas, auth_utils

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    created = crud.create_user(db, user.name, user.email, user.password)  # adjust create_user signature
    return created

@router.post("/login")
def login(credentials: schemas.LoginForm, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # create token with sub = user.id (string)
    token = auth_utils.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}
