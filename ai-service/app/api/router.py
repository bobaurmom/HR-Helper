from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/v1/status", tags=["system"])
def status() -> dict[str, str]:
    return {"status": "ready"}
