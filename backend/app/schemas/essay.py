from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class EssayAnalysisRequest(BaseModel):
    essay: str = Field(..., description="Raw text of the essay to be analyzed")
    title: Optional[str] = Field(default="Untitled Essay", description="Title of the essay")

class SentencePattern(BaseModel):
    name: str
    description: Optional[str] = None

class SentenceAnalysis(BaseModel):
    id: str
    index: int
    text: str
    label: Literal['human', 'uncertain', 'ai']
    aiProbability: float
    confidence: Literal['low', 'medium', 'high']
    patterns: List[SentencePattern] = []
    explanation: str
    suggestion: Optional[str] = None
    paragraphIndex: int

class WritingMetrics(BaseModel):
    vocabularyDiversity: float
    sentenceVariation: float
    sentenceComplexity: float
    readability: float
    grammar: float
    passiveVoice: float
    emotionalTone: float
    vocabularyRichness: float
    writingConsistency: float

class WritingFingerprint(BaseModel):
    vocabulary: float
    sentenceRhythm: float
    complexity: float
    punctuation: float
    formality: float
    uniqueness: float

class ParagraphRisk(BaseModel):
    paragraphIndex: int
    label: str
    aiProbability: float

class Improvement(BaseModel):
    id: str
    category: Literal['vocabulary', 'sentence-structure', 'readability', 'authenticity']
    issue: str
    suggestion: str
    severity: Literal['low', 'medium', 'high']

class EssayAnalysisResponse(BaseModel):
    essayId: str
    authenticityScore: float
    aiProbability: float
    confidence: Literal['low', 'medium', 'high']
    classification: str
    writingQuality: float
    originality: float
    sentences: List[SentenceAnalysis]
    metrics: WritingMetrics
    fingerprint: WritingFingerprint
    paragraphRisks: List[ParagraphRisk]
    improvements: List[Improvement]
    analyzedAt: str
    summary: Optional[str] = None
    whyThisResult: Optional[str] = None
    evidenceStrength: Optional[Literal['Limited', 'Moderate', 'Strong']] = None
    genreObservation: Optional[str] = None
    signals: Optional[Dict[str, Any]] = None
    limitations: Optional[List[str]] = None
    reliability_notice: Optional[str] = "Detection is probabilistic and should not be treated as proof of AI authorship."

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str
    reliability_notice: str

class EssayCompareRequest(BaseModel):
    essayA: str = Field(..., description="Raw text of first essay")
    essayB: str = Field(..., description="Raw text of second essay")
    titleA: Optional[str] = Field(default="Essay A", description="Title of first essay")
    titleB: Optional[str] = Field(default="Essay B", description="Title of second essay")

class CompareSubjectScore(BaseModel):
    subject: str
    A: float
    B: float

class CompareSimilarityMetric(BaseModel):
    label: str
    a: float
    b: float
    result: float
    description: str

class EssayCompareResponse(BaseModel):
    essayA: EssayAnalysisResponse
    essayB: EssayAnalysisResponse
    titleA: str
    titleB: str
    vocabularySimilarity: float
    sentenceStyleSimilarity: float
    writingConsistencySimilarity: float
    overallSimilarity: float
    similarityMetrics: List[CompareSimilarityMetric]
    radarComparison: List[CompareSubjectScore]
    stylisticShiftObservation: str

class BatchEssayItem(BaseModel):
    id: Optional[str] = None
    title: str
    text: str

class BatchEssayAnalysisRequest(BaseModel):
    essays: List[BatchEssayItem]

class BatchEssayAnalysisResponse(BaseModel):
    results: List[EssayAnalysisResponse]
    totalAnalyzed: int

class AdminStatsResponse(BaseModel):
    totalEssaysAnalyzed: int
    activeUsers: int
    averageAuthenticity: float
    systemModelVersion: str
    totalInstitutions: int
    lowRiskCount: int
    mediumRiskCount: int
    highRiskCount: int

class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    institution: Optional[str] = None
    createdAt: str
    essaysCount: int

class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    actor: str
    action: str
    details: str
    status: str
