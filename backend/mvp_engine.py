"""Core MVP planning logic."""

from __future__ import annotations

from typing import Any


DEMO_WORKSPACE: dict[str, Any] = {
    "project": "Studyplan",
    "idea": "build a medium level studyplan",
    "audience": "students and advisors",
    "record_label": "Study Plan Request",
    "workflow_label": "Learning Sprint",
    "metric_label": "Progress Metrics",
    "workflow": [
        "Needs assessment",
        "Plan drafted",
        "Session booked",
        "Progress reviewed"
    ],
    "features": [
        "Capture study plan request requests with priority, owner, and due date.",
        "Turn each intake into a learning sprint workflow with next actions.",
        "Expose progress metrics, queue, and intake summaries through FastAPI."
    ],
    "metrics": [
        {
            "label": "Open items",
            "value": "3",
            "delta": "2 need attention"
        },
        {
            "label": "Response time",
            "value": "14m",
            "delta": "from intake to owner"
        },
        {
            "label": "On track",
            "value": "82%",
            "delta": "target workflow health"
        },
        {
            "label": "Blocked",
            "value": "1",
            "delta": "waiting on outside input"
        }
    ],
    "intake_template": {
        "goal": "Schedule biology exam review plan",
        "segment": "Exam prep",
        "priority": "High",
        "owner": "Avery Chen"
    },
    "queue": [
        {
            "id": "item-1",
            "title": "Schedule biology exam review plan",
            "segment": "Exam prep",
            "owner": "Avery Chen",
            "priority": "High",
            "status": "Needs assessment",
            "due": "today"
        },
        {
            "id": "item-2",
            "title": "Break capstone project into weekly tasks",
            "segment": "Project work",
            "owner": "Taylor Kim",
            "priority": "Normal",
            "status": "Plan drafted",
            "due": "tomorrow"
        },
        {
            "id": "item-3",
            "title": "Prepare office-hours question queue",
            "segment": "Office hours",
            "owner": "Morgan Diaz",
            "priority": "Low",
            "status": "Session booked",
            "due": "Friday"
        }
    ],
    "agent_team": [
        {
            "name": "Strategist Agent",
            "role": "Scope and success metric",
            "status": "Ready",
            "output": "Narrows learning sprint to one demo path for students and advisors."
        },
        {
            "name": "Research Agent",
            "role": "Context and constraints",
            "status": "Ready",
            "output": "Tracks source warnings, domain rules, and study plan request requirements."
        },
        {
            "name": "Builder Agent",
            "role": "App and API",
            "status": "Ready",
            "output": "Generates the React workspace, FastAPI routes, and database-ready schema."
        },
        {
            "name": "QA Agent",
            "role": "Risk checks",
            "status": "Ready",
            "output": "Checks queue states, blocked work, and smoke-test coverage before demo."
        },
        {
            "name": "Demo Agent",
            "role": "Stakeholder narrative",
            "status": "Ready",
            "output": "Packages the walkthrough, API payload, and next implementation steps."
        }
    ],
    "next_actions": [
        "Assign an owner and deadline to the newest study plan request.",
        "Move one item from needs assessment to plan drafted.",
        "Review the API response with the frontend before adding persistence."
    ],
    "implementation_steps": [
        "Initialize monorepo with apps/web (React+TS+Tailwind) and apps/api (FastAPI).",
        "Add Supabase client and Nemotron helper libraries to frontend and backend.",
        "Create backend endpoint /generate-plan that receives study goals, calls Nemotron embedding/rerank/reasoning, stores plan in Supabase.",
        "Create frontend form for user input and display area for returned plan.",
        "Wire frontend to call backend endpoint and show loading/spinner states.",
        "Add GitHub Agent script that, after plan generation, commits a summary markdown to repo via Octokit.",
        "Add .env.example with placeholders for NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY.",
        "Create README with problem statement, setup instructions, and NVIDIA/Nemotron usage explanation."
    ]
}


def build_demo_workspace() -> dict[str, Any]:
    return DEMO_WORKSPACE


def build_demo_plan(idea: str, features: list[str]) -> dict[str, Any]:
    return {
        'idea': idea,
        'features': features,
        'audience': DEMO_WORKSPACE['audience'],
        'metrics': DEMO_WORKSPACE['metrics'],
        'agent_team': DEMO_WORKSPACE['agent_team'],
        'queue': DEMO_WORKSPACE['queue'],
        'next_actions': DEMO_WORKSPACE['next_actions'],
    }


def summarize_intake(payload: dict[str, Any]) -> dict[str, Any]:
    goal = str(payload.get('user_goal') or '').strip()
    urgency = str(payload.get('urgency') or 'normal').strip().lower()
    segment = str(payload.get('segment') or DEMO_WORKSPACE['audience']).strip()
    owner = str(payload.get('owner') or DEMO_WORKSPACE['intake_template']['owner']).strip()
    priority = 'high' if urgency in {'urgent', 'high', 'critical'} else 'normal'
    first_action = DEMO_WORKSPACE['next_actions'][0]
    return {
        'summary': goal or "build a medium level studyplan",
        'priority': priority,
        'segment': segment,
        'owner': owner,
        'status': DEMO_WORKSPACE['workflow'][0],
        'recommended_first_step': first_action,
    }