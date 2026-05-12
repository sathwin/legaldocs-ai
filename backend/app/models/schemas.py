from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class PipelineStage(str, Enum):
    uploaded = "Uploaded"
    ocr_extracted = "OCR Extracted"
    chunked = "Chunked"
    embedded = "Embedded"
    retrieved = "Retrieved"
    summarized = "Summarized"
    completed = "Completed"


class Document(BaseModel):
    id: str
    name: str
    content: str
    created_at: str
    owner: str = "demo@legaldocs.ai"
    tags: list[str] = Field(default_factory=list)
    job_id: str


class DocumentSummary(BaseModel):
    id: str
    name: str
    created_at: str
    tags: list[str]
    job_id: str
    status: str = "Ready"


class Clause(BaseModel):
    type: str
    title: str
    text: str
    risk: RiskLevel
    rationale: str
    recommendation: str = "Review against company playbook."


class DashboardStats(BaseModel):
    total_documents: int
    analyzed_documents: int
    high_risk_clauses: int
    medium_risk_clauses: int
    average_processing_ms: int
    provider: str


class ContractAnalysisRequest(BaseModel):
    document_id: str


class ContractAnalysisResponse(BaseModel):
    document_id: str
    summary: str
    overall_risk: RiskLevel
    clauses: list[Clause]
    recommendations: list[str]
    sample_output: dict[str, str] = Field(default_factory=dict)


class CompareRequest(BaseModel):
    document_a_id: str
    document_b_id: str


class ComparisonItem(BaseModel):
    area: str
    document_a: str
    document_b: str
    risk_delta: str


class CompareResponse(BaseModel):
    document_a_id: str
    document_b_id: str
    executive_summary: str
    differences: list[ComparisonItem]


class ChatRequest(BaseModel):
    document_id: str
    question: str
    role: str = "legal_reviewer"


class ChatResponse(BaseModel):
    answer: str
    citations: list[str]
    retrieval_context: list[str]
    model_provider: str
    prompt_preview: str


class PipelineStatus(BaseModel):
    job_id: str
    stages: list[dict[str, Any]]
    status: str
