from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.fire import router as fire_router
from routers.reports import router as reports_router
from routers.species import router as species_router
from routers.auth import router as auth_router

app = FastAPI(title="Gaia Phylax API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(fire_router)
app.include_router(reports_router)
app.include_router(species_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Gaia Phylax API is alive"
    }