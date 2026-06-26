import os
from typing import Optional

import httpx
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing SUPABASE_URL in .env")

if not SUPABASE_ANON_KEY:
    raise ValueError("Missing SUPABASE_ANON_KEY in .env")


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str


class LoginRequest(BaseModel):
    email: str
    password: str


def supabase_headers(token: Optional[str] = None):
    bearer = token or SUPABASE_ANON_KEY

    return {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {bearer}",
        "Content-Type": "application/json",
    }


def normalize_user(user: dict):
    metadata = user.get("user_metadata") or {}

    return {
        "user_id": user.get("id"),
        "email": user.get("email"),
        "name": metadata.get("name") or metadata.get("full_name") or user.get("email", "Guardian"),
        "picture": metadata.get("picture"),
        "points": 0,
        "level": 1,
        "active_pet_id": None,
        "unlocked_pets": [],
        "auth_provider": "supabase",
    }


def normalize_auth_response(data: dict):
    token = (
        data.get("access_token")
        or (data.get("session") or {}).get("access_token")
    )

    user = data.get("user")

    return {
        "session_token": token,
        "user": normalize_user(user) if user else None,
        "raw": data,
    }


async def supabase_auth_request(
    method: str,
    path: str,
    json: Optional[dict] = None,
    token: Optional[str] = None,
):
    url = f"{SUPABASE_URL}/auth/v1{path}"

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.request(
            method,
            url,
            headers=supabase_headers(token),
            json=json,
        )

    if response.status_code >= 400:
        try:
            detail = response.json()
        except Exception:
            detail = response.text

        raise HTTPException(status_code=response.status_code, detail=detail)

    if not response.text:
        return {}

    return response.json()


@router.post("/register")
async def register(payload: RegisterRequest):
    data = await supabase_auth_request(
        "POST",
        "/signup",
        json={
            "email": payload.email,
            "password": payload.password,
            "data": {
                "name": payload.name,
            },
        },
    )

    return normalize_auth_response(data)


@router.post("/login")
async def login(payload: LoginRequest):
    data = await supabase_auth_request(
        "POST",
        "/token?grant_type=password",
        json={
            "email": payload.email,
            "password": payload.password,
        },
    )

    return normalize_auth_response(data)


@router.get("/me")
async def me(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")

    token = authorization.replace("Bearer ", "").strip()

    data = await supabase_auth_request(
        "GET",
        "/user",
        token=token,
    )

    return normalize_user(data)


@router.post("/logout")
async def logout(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"ok": True}

    token = authorization.replace("Bearer ", "").strip()

    await supabase_auth_request(
        "POST",
        "/logout",
        token=token,
    )

    return {"ok": True}