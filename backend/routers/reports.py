from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from services.supabase_client import supabase

router = APIRouter(prefix="/reports", tags=["reports"])

class ReportInteraction(BaseModel):
    actor_key: str | None = None


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
    image_url: str | None = None
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


@router.post("/{report_id}/view")
def register_report_view(report_id: str, interaction: ReportInteraction):
    report_response = (
        supabase
        .table("citizen_reports")
        .select("id, view_count, boost_count")
        .eq("id", report_id)
        .limit(1)
        .execute()
    )

    if not report_response.data:
        raise HTTPException(status_code=404, detail="Report not found")

    report = report_response.data[0]

    supabase.table("report_views").insert({
        "report_id": report_id,
        "actor_key": interaction.actor_key,
    }).execute()

    new_view_count = (report.get("view_count") or 0) + 1
    boost_count = report.get("boost_count") or 0

    supabase.table("citizen_reports").update({
        "view_count": new_view_count,
    }).eq("id", report_id).execute()

    return {
        "id": report_id,
        "view_count": new_view_count,
        "boost_count": boost_count,
        "added": True,
    }


@router.post("/{report_id}/boost")
def register_report_boost(report_id: str, interaction: ReportInteraction):
    report_response = (
        supabase
        .table("citizen_reports")
        .select("id, view_count, boost_count")
        .eq("id", report_id)
        .limit(1)
        .execute()
    )

    if not report_response.data:
        raise HTTPException(status_code=404, detail="Report not found")

    report = report_response.data[0]

    supabase.table("report_boosts").insert({
        "report_id": report_id,
        "actor_key": interaction.actor_key,
    }).execute()

    view_count = report.get("view_count") or 0
    new_boost_count = (report.get("boost_count") or 0) + 1

    supabase.table("citizen_reports").update({
        "boost_count": new_boost_count,
    }).eq("id", report_id).execute()

    return {
        "id": report_id,
        "view_count": view_count,
        "boost_count": new_boost_count,
        "added": True,
    }