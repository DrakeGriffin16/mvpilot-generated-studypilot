# Study Plan Generator MVP

## Overview
This repository contains a minimum viable product (MVP) for generating a medium‑level study plan. The user enters study goals and constraints via a React frontend. The FastAPI backend calls NVIDIA Nemotron models (embeddings, reranking, and reasoning) to create a balanced plan, stores it in Supabase Postgres with pgvector, and returns the plan to the UI. After successful generation, a GitHub agent commits a summary of the plan to the repository.

## Features
- React + TypeScript + Tailwind CSS frontend
- FastAPI backend with Uvicorn
- Supabase Postgres database with pgvector for vector search
- NVIDIA Nemotron embeddings (llama-nemotron-embed-1b-v2)
- NVIDIA Nemotron reranking (llama-nemotron-rerank-1b-v2)
- NVIDIA Nemotron reasoning model for plan generation
- GitHub integration via Octokit to log plan summaries
- Environment variable‑based secret management (backend only)

## Getting Started

### Prerequisites
- Node.js (>=18) and npm
- Python (>=3.12)
- A Supabase project with Postgres and pgvector enabled
- NVIDIA API keys for the Nemotron models

### Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-dir>
   ```

2. Backend:
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp ../../.env.example .env   # edit .env with your keys
   uvicorn main:app --reload
   ```

3. Frontend:
   ```bash
   cd ../web
   npm install
   cp ../../.env.example .env.local   # edit if needed (frontend only needs Supabase anon key)
   npm run dev
   ```

4. Ensure the backend is reachable at `http://localhost:8000` and the frontend at `http://localhost:3000`.

### Usage
1. Open the frontend in your browser.
2. Fill out the study goal form (subject, depth, time commitment, constraints).
3. Submit the form.
4. The backend will call the Nemotron embedding, rerank, and reasoning APIs, generate a medium‑level study plan, store it in Supabase, and return the plan.
5. The plan is displayed in the StudyPlanDisplay component.
6. Upon successful generation, the GitHub agent creates a commit with a markdown summary of the plan.

## NVIDIA Nemotron Usage
- **Embeddings**: Convert the user's study goals into vector representations using `llama-nemotron-embed-1b-v2`.
- **Reranking**: Re‑rank relevant knowledge fragments retrieved from the RAG pipeline with `llama-nemotron-rerank-1b-v2`.
- **Reasoning**: Feed the reranked context into the Nemotron reasoning model to produce a coherent, balanced study plan.
All calls are made from the backend services (`apps/api/services/nemotron.py`) and never expose API keys to the frontend.

## Project Structure
```
README.md
.env.example
docs/
  ARCHITECTURE.md
  BUILD_LOG.md
apps/
  web/          # React + TS + Tailwind frontend
  api/          # FastAPI backend
rag/
  sources/      # Knowledge base for RAG
logs/
  .gitkeep
.github/
  workflows/
    ci.yml      # GitHub Actions for lint, type‑check, tests
```

## Development
- Linting: `eslint` (frontend) and `flake8` (backend)
- Type checking: `tsc` (frontend) and `mypy` (backend) (optional)
- Tests: Run `pytest` for backend and `npm test` for frontend.

## License
This project is licensed under the MIT License.