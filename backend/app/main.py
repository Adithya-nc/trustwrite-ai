from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.endpoints import router as api_router

app = FastAPI(
    title="TrustWrite AI Admissions Essay Detector API",
    description="Backend analysis service utilizing statistical ML and NLP stylometrics for college admissions essays.",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler — never expose raw stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred.",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )

# Include API Router
app.include_router(api_router, prefix="/api")

@app.get("/")
def root_redirect():
    return {
        "name": "TrustWrite AI Detector API",
        "health": "/api/health",
        "docs": "/docs"
    }
