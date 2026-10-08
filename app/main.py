import os
import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

load_dotenv()

from app.database import init_db
from app.routers import weather, plan, garden, doctor, scanner, chat, voice, journal, telemetry, profile

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("growthisweek")

# Initialize SQLite database
init_db()

app = FastAPI(
    title="GrowThisWeek API",
    description="Grounded AI Garden Planner powered by Gemma 4",
    version="1.0.0"
)

# Enable CORS for production & dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware: Request timing & Rate limiting header logging
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": "GrowThisWeek",
        "gemma_model": "gemma-4-26b-a4b-it",
        "fallback_model": "gemma-4-31b-it",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Register Routers
app.include_router(weather.router)
app.include_router(plan.router)
app.include_router(garden.router)
app.include_router(doctor.router)
app.include_router(scanner.router)
app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(journal.router)
app.include_router(telemetry.router)
app.include_router(profile.router)

# Serve built frontend static files in production if dist directory exists
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            return {"error": "API route not found"}
        target_file = os.path.join(frontend_dist, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
