from fastapi import APIRouter, Query
from services.supabase_client import supabase

router = APIRouter(prefix="/fires", tags=["fires"])


@router.get("/")
def get_fires(
    limit: int = Query(default=100, ge=1, le=1000),
    intensity: str | None = None
):
    query = supabase.table("fire_nasa").select("*").limit(limit)

    if intensity:
        query = query.eq("fire_intensity", intensity)

    response = query.execute()
    return response.data


@router.get("/high")
def get_high_fires(limit: int = Query(default=100, ge=1, le=1000)):
    response = (
        supabase
        .table("fire_nasa")
        .select("*")
        .eq("fire_intensity", "high")
        .limit(limit)
        .execute()
    )

    return response.data