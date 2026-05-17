"""FastAPI surface for the generated MVP."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.mvp_engine import build_demo_plan, build_demo_workspace, summarize_intake


app = FastAPI(title="Studyplan")


app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Intake(BaseModel):
    user_goal: str
    urgency: str = 'normal'
    segment: str = "students and advisors"
    owner: str = "Avery Chen"
    notes: str | None = None


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok', 'service': "Studyplan"}


@app.get('/api/demo-data')
def demo_data() -> dict[str, object]:
    return build_demo_workspace()


@app.get('/api/demo-plan')
def demo_plan() -> dict[str, object]:
    return build_demo_plan("build a medium level studyplan", ["Capture study plan request requests with priority, owner, and due date.", "Turn each intake into a learning sprint workflow with next actions.", "Expose progress metrics, queue, and intake summaries through FastAPI."])


@app.post('/api/intake')
def intake(payload: Intake) -> dict[str, object]:
    return summarize_intake(payload.model_dump())