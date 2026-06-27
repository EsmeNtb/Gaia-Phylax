from fastapi import APIRouter, Query
from services.supabase_client import supabase

router = APIRouter(prefix="/species", tags=["species"])


@router.get("/")
def get_species(limit: int = Query(default=100, ge=1, le=1000)):
    response = (
        supabase
        .table("animalia_species_catalog")
        .select("*")
        .limit(limit)
        .execute()
    )

    return response.data


@router.get("/search")
def search_species(
    q: str = Query(..., min_length=2),
    limit: int = Query(default=50, ge=1, le=500)
):
    response = (
        supabase
        .table("animalia_species_catalog")
        .select("*")
        .ilike("scientific_name", f"%{q}%")
        .limit(limit)
        .execute()
    )

    return response.data


@router.get("/taxonomy/search")
def search_taxonomy(
    q: str = Query(..., min_length=2),
    limit: int = Query(default=20, ge=1, le=100),
):
    response = (
        supabase
        .table("animalia_taxonomy")
        .select("*")
        .ilike("scientific_name", f"%{q}%")
        .limit(limit)
        .execute()
    )

    return response.data