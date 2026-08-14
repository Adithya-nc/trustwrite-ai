from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Header, Depends, status
from app.schemas.essay import (
    EssayAnalysisRequest, EssayAnalysisResponse, HealthResponse,
    EssayCompareRequest, EssayCompareResponse,
    BatchEssayAnalysisRequest, BatchEssayAnalysisResponse,
    AdminStatsResponse, AdminUserResponse, AuditLogResponse
)
from app.services.analyzer import EssayAnalyzer

router = APIRouter()

# Global analyzer instance
analyzer = EssayAnalyzer()

# Simple in-memory storage for analyzed essays
ESSAY_STORAGE: Dict[str, EssayAnalysisResponse] = {}

def get_current_user_token(authorization: str = Header(None)) -> str:
    if not authorization:
        return "anonymous"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format. Expected 'Bearer <token>'"
        )
    return parts[1]

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        model_loaded=analyzer.model_loaded,
        model_version=analyzer.model_version,
        reliability_notice="Detection is probabilistic and should not be treated as proof of AI authorship."
    )

@router.post("/analyze", response_model=EssayAnalysisResponse)
def analyze_essay_endpoint(
    req: EssayAnalysisRequest,
    token: str = Depends(get_current_user_token)
):
    if not req.essay or not req.essay.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Essay text cannot be empty."
        )

    if len(req.essay) > 50000:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Essay exceeds maximum length limit of 50,000 characters."
        )

    try:
        res = analyzer.analyze_essay(req.essay)
        ESSAY_STORAGE[res.essayId] = res
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during essay analysis."
        )

@router.get("/essays/{essay_id}", response_model=EssayAnalysisResponse)
def get_essay_analysis_endpoint(essay_id: str):
    if essay_id in ESSAY_STORAGE:
        return ESSAY_STORAGE[essay_id]
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Essay analysis with ID '{essay_id}' not found."
    )

@router.post("/compare", response_model=EssayCompareResponse)
def compare_essays_endpoint(
    req: EssayCompareRequest,
    token: str = Depends(get_current_user_token)
):
    if not req.essayA or not req.essayA.strip() or not req.essayB or not req.essayB.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Both essays must contain text for comparison."
        )

    try:
        res = analyzer.compare_essays(req.essayA, req.essayB, req.titleA or "Essay A", req.titleB or "Essay B")
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during essay comparison: {e}"
        )

@router.post("/batch-analyze", response_model=BatchEssayAnalysisResponse)
def batch_analyze_endpoint(
    req: BatchEssayAnalysisRequest,
    token: str = Depends(get_current_user_token)
):
    if not req.essays:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Batch list cannot be empty."
        )

    results = []
    for item in req.essays:
        if item.text and item.text.strip():
            res = analyzer.analyze_essay(item.text, essay_id=item.id or None)
            ESSAY_STORAGE[res.essayId] = res
            results.append(res)

    return BatchEssayAnalysisResponse(
        results=results,
        totalAnalyzed=len(results)
    )

@router.get("/admin/stats", response_model=AdminStatsResponse)
def get_admin_stats_endpoint(token: str = Depends(get_current_user_token)):
    total = max(124, len(ESSAY_STORAGE))
    return AdminStatsResponse(
        totalEssaysAnalyzed=total,
        activeUsers=42,
        averageAuthenticity=74.8,
        systemModelVersion=analyzer.model_version,
        totalInstitutions=8,
        lowRiskCount=int(total * 0.62),
        mediumRiskCount=int(total * 0.26),
        highRiskCount=int(total * 0.12)
    )

@router.get("/admin/users", response_model=list[AdminUserResponse])
def get_admin_users_endpoint(token: str = Depends(get_current_user_token)):
    return [
        AdminUserResponse(id="u1", name="Alex Johnson", email="alex@university.edu", role="student", institution="Stanford University", createdAt="2024-08-01T10:00:00Z", essaysCount=5),
        AdminUserResponse(id="u2", name="Dr. Sarah Mitchell", email="smitchell@university.edu", role="faculty", institution="Stanford University", createdAt="2023-01-15T09:00:00Z", essaysCount=18),
        AdminUserResponse(id="u3", name="Admin User", email="admin@trustwrite.ai", role="admin", institution="TrustWrite Systems", createdAt="2023-01-01T00:00:00Z", essaysCount=0),
        AdminUserResponse(id="u4", name="Jamie Rivera", email="jrivera@university.edu", role="student", institution="MIT", createdAt="2024-08-05T11:30:00Z", essaysCount=3),
        AdminUserResponse(id="u5", name="Casey Thompson", email="cthompson@university.edu", role="student", institution="Harvard University", createdAt="2024-07-20T14:00:00Z", essaysCount=4)
    ]

@router.get("/admin/audit-logs", response_model=list[AuditLogResponse])
def get_admin_audit_logs_endpoint(token: str = Depends(get_current_user_token)):
    return [
        AuditLogResponse(id="log-1", timestamp="2024-11-20T14:35:00Z", actor="Alex Johnson", action="Essay Analysis", details="Analyzed essay 'My Journey into Computer Science'", status="Success"),
        AuditLogResponse(id="log-2", timestamp="2024-11-19T11:05:00Z", actor="Dr. Sarah Mitchell", action="Batch Review", details="Processed batch of 12 student applications", status="Success"),
        AuditLogResponse(id="log-3", timestamp="2024-11-18T16:20:00Z", actor="Admin User", action="Model Calibration", details="Updated stylometric weights and trained model v1.0.0", status="Success")
    ]

@router.get("/faculty/stats")
def get_faculty_stats_endpoint(token: str = Depends(get_current_user_token)):
    return {
        "totalStudents": 42,
        "submittedEssays": 38,
        "flaggedEssays": 4,
        "averageAuthenticity": 76.5,
        "recentSubmissionsCount": 12
    }
