from fastapi import APIRouter, Query
from pydantic import BaseModel
from services.supabase_client import supabase

router = APIRouter(prefix="/reports", tags=["reports"])


class CitizenReportCreate(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    latitude: float
    longitude: float
    country: str | None = None
    city: str | None = None
    urgency: str | None = "medium"
    status: str | None = "open"
    related_species: str | None = None


@router.get("/")
def get_reports(limit: int = Query(default=100, ge=1, le=1000)):
    response = (
        supabase
        .table("citizen_reports")
        .select("*")
        .limit(limit)
        .execute()
    )

    return response.data


@router.post("/")
def create_report(report: CitizenReportCreate):
    response = (
        supabase
        .table("citizen_reports")
        .insert(report.model_dump())
        .execute()
    )

    return response.data