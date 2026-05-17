# Medium level studyplan Architecture

Original idea: build a medium level studyplan

## Components

- React frontend in `src/` for the demo workflow.
- FastAPI backend in `backend/` for health, planning, study plan request intake, and demo data endpoints.
- Postgres schema in `docs/DATABASE_SCHEMA.sql` for the first persistence pass.
- Pytest smoke tests in `tests/` for generated backend logic.

## Demo Domain

- Audience: students and advisors.
- Workflow: Needs assessment, Plan drafted, Session booked, Progress reviewed.
- Metrics: Progress Metrics.

## Generated Subagents

- Strategist Agent scopes the demo and selects the success metric.
- Research Agent turns source context into constraints and warnings.
- Builder Agent produces the frontend/API/database slice.
- QA Agent checks risks, blocked work, and demo readiness.
- Demo Agent packages the walkthrough for stakeholders.

## Stack Decision

Frontend UI: React or Next.js, Backend API: FastAPI, Database: Supabase Postgres, Vector search: Supabase pgvector, Embeddings: NVIDIA llama-nemotron-embed-1b-v2, Reranking: NVIDIA llama-nemotron-rerank-1b-v2, Orchestrator reasoning: Nemotron reasoning model, GitHub integration: GitHub API or Octokit, Secrets: backend-only environment variables, TypeScript, Tailwind CSS, Python 3.12, Uvicorn, pytest, npm run build

## Implementation Steps

1. Initialize monorepo with apps/web (React+TS+Tailwind) and apps/api (FastAPI).
2. Add Supabase client and Nemotron helper libraries to frontend and backend.
3. Create backend endpoint /generate-plan that receives study goals, calls Nemotron embedding/rerank/reasoning, stores plan in Supabase.
4. Create frontend form for user input and display area for returned plan.
5. Wire frontend to call backend endpoint and show loading/spinner states.
6. Add GitHub Agent script that, after plan generation, commits a summary markdown to repo via Octokit.
7. Add .env.example with placeholders for NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY.
8. Create README with problem statement, setup instructions, and NVIDIA/Nemotron usage explanation.