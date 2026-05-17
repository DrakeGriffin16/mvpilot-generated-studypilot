from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from .routers import study

load_dotenv()  # Load environment variables from .env (not committed)

app = FastAPI(
    title="Study Plan Generator API",
    description="Backend for generating medium-level study plans using NVIDIA Nemotron models.",
    version="0.1.0",
)

# CORS middleware - adjust origins as needed for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the study plan router
app.include_router(study.router, prefix="/api", tags=["study"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "study-plan-api"}

@app.get("/")
async def root():
    return {"message": "Welcome to the Study Plan Generator API. See /docs for Swagger UI."}