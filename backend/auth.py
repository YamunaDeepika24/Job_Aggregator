import jwt
from fastapi import Header, HTTPException

SECRET = "SECRET123"

def get_current_user(Authorization: str = Header(None)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = Authorization.split(" ")[1]
        data = jwt.decode(token, SECRET, algorithms=["HS256"])
        return data
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
