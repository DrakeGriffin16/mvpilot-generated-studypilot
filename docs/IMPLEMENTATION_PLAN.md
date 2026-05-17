# Implementation Plan

## Overview
This document outlines the step‑by‑step implementation of the Medium Level Study Plan MVP, aligning with the resolved tech stack and repo plan.

## Prerequisites
- Node.js >= 18
- Python 3.12
- Git
- Supabase project with pgvector enabled
- NVIDIA API access for Nemotron models (embeddings, reranking, reasoning)

## Phase 0: Repository Setup
1. Create monorepo root.
2. Initialize apps/web (React + TypeScript + Tailwind) using `vite` or `create-react-app`.
3. Initialize apps/api (FastAPI) with `poetry` or `pipenv`.
4. Add `.gitignore` for node_modules, __pycache__, .env, etc.
5. Add docs/ folder with ARCHITECTURE.md and BUILD_LOG.md placeholders.

## Phase 1: Frontend Foundation
1. Install dependencies: `react`, `react-dom`, `@types/react`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`.
2. Configure `tsconfig.json` with strict mode.
3. Set up Tailwind via `postcss.config.js` and `tailwind.config.js`.
4. Create `src/index.tsx` rendering `<App />`.
5. Create `src/App.tsx` with basic layout and router placeholder.
6. Add `src/lib/supabaseClient.ts` initializing Supabase client using anon key from env.
7. Add `src/lib/nemotronClient.ts` with functions:
   - `embedText(text: string): Promise<number[]>`
   - `rerank(query: string, docs: string[]): Promise<number[]>`
   - `reason(prompt: string): Promise<string>`
   Each wraps fetch to backend Nemotron service (or direct API if backend proxies).
8. Create components:
   - `StudyForm.tsx`: form with fields for study goal, duration, difficulty, constraints; onSubmit calls `/generate-plan`.
   - `StudyPlanDisplay.tsx`: renders plan as markdown or structured list.
9. Connect form to state, show loading spinner, display errors.

## Phase 2: Backend Foundation
1. Install dependencies: `fastapi`, `uvicorn[standard]`, `supabase`, `httpx`, `python-dotenv`, `pytest`.
2. Create `apps/api/main.py`:
   - Initialize FastAPI app.
   - Add CORS middleware allowing frontend origin.
   - Import and include router from `routers/study.py`.
3. Create `apps/api/routers/study.py`:
   - POST `/generate-plan` endpoint.
   - Receive JSON: `{goal: string, duration?: string, difficulty?: string, constraints?: string[]}`.
   - Call Nemotron services via `services/nemotron.py`.
   - Store plan in Supabase table `study_plans` (columns: id, user_id?, goal, plan_text, created_at).
   - Return plan text and Supabase ID.
4. Create `apps/api/services/nemotron.py`:
   - Functions `get_embedding`, `get_rerank`, `get_reasoning` using `httpx.AsyncClient` to NVIDIA endpoints.
   - Load API key from `os.getenv("NVIDIA_API_KEY")`.
   - Raise HTTPException with detail if missing.
5. Create `apps/api/models.py` with Pydantic models for request/response.
6. Create `apps/api/database.py` with Supabase client initialization (service_role key for backend).
7. Add `.env.example` with placeholders:
   ```
   NVIDIA_API_KEY=
   SUPABASE_URL=
   SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

## Phase 3: Integration & GitHub Agent
1. Implement GitHub Agent script (could be a backend route or separate worker):
   - After successful plan generation, use `@octokit/rest` (or simple curl) to create a commit.
   - Commit message: `chore: add study plan summary for goal "<goal>"`.
   - File path: `plans/<timestamp>-<slug>.md` containing summary.
   - Requires `GITHUB_TOKEN` stored as backend secret (not in repo).
2. Add environment variable placeholders for GitHub token in `.env.example` (commented out).

## Phase 4: Documentation & Logging
1. Fill `docs/ARCHITECTURE.md` with component diagram and data flow.
2. Initialize `docs/BUILD_LOG.md`; each agent appends timestamped entries.
3. Create `logs/` folder with `.gitkeep`.
4. Update `README.md` with:
   - Problem statement.
   - Setup instructions (frontend dev, backend dev, env vars).
   - Explanation of NVIDIA Nemotron usage (embeddings, reranking, reasoning).
   - Demo steps.

## Phase 5: Testing & CI
1. Add Jest and React Testing Library to frontend; write unit tests for StudyForm and StudyPlanDisplay.
2. Add pytest tests for backend:
   - Unit test for `/generate-plan` mocking Nemotron calls.
   - Integration test using test Supabase database.
3. Configure ESLint and Prettier.
4. Add GitHub Actions workflow `.github/workflows/ci.yml`:
   - On push/pull_request.
   - Jobs: install, lint, type-check, test (frontend & backend), build.
5. Ensure `npm run build` and `uvicorn apps.api.main:app` work in CI.

## Phase 6: Demo Verification
1. Run dev servers: `npm run dev` (frontend) and `uvicorn apps.api.main:app --reload` (backend).
2. Open browser, fill study goal, submit.
3. Verify plan appears, stored in Supabase, and a commit appears in GitHub repo.
4. Check logs/BUILD_LOG.md for entries.

## Optional Enhancements
- Dockerfile for backend.
- Storybook for UI components.
- Additional RAG sources in `rag/sources/`.

## Conclusion
Following these steps will produce a functional MVP that leverages NVIDIA Nemotron models for embedding, reranking, and reasoning, stores results in Supabase with pgvector, and demonstrates GitHub integration via automated commits.