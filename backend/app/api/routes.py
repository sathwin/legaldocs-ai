from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import get_settings
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    CompareRequest,
    CompareResponse,
    ContractAnalysisRequest,
    ContractAnalysisResponse,
    DashboardStats,
    Document,
    DocumentSummary,
    PipelineStatus,
)
from app.services.analysis_service import analysis_service
from app.services.comparison_service import comparison_service
from app.services.document_service import DocumentNotFoundError, UnsupportedDocumentError, document_service
from app.services.pipeline_service import pipeline_service
from app.services.rag_service import rag_service

router = APIRouter()


@router.get("/dashboard/stats", response_model=DashboardStats)
def dashboard_stats() -> DashboardStats:
    return document_service.dashboard_stats(provider=get_settings().llm_provider)


@router.post("/documents/upload", response_model=DocumentSummary)
async def upload_document(file: UploadFile = File(...)) -> DocumentSummary:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    raw = await file.read()
    content = raw.decode("utf-8", errors="replace")
    try:
        return document_service.upload_text_document(name=file.filename, content=content)
    except UnsupportedDocumentError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/documents", response_model=list[DocumentSummary])
def list_documents() -> list[DocumentSummary]:
    return document_service.list_documents()


@router.get("/documents/{document_id}", response_model=Document)
def get_document(document_id: str) -> Document:
    return _get_document_or_404(document_id)


@router.post("/contracts/analyze", response_model=ContractAnalysisResponse)
def analyze(request: ContractAnalysisRequest) -> ContractAnalysisResponse:
    return analysis_service.analyze_contract(_get_document_or_404(request.document_id))


@router.post("/contracts/compare", response_model=CompareResponse)
def compare(request: CompareRequest) -> CompareResponse:
    if request.document_a_id == request.document_b_id:
        raise HTTPException(status_code=400, detail="Select two different documents to compare")
    return comparison_service.compare_contracts(
        _get_document_or_404(request.document_a_id),
        _get_document_or_404(request.document_b_id),
    )


@router.post("/chat/query", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    if len(request.question.strip()) < 4:
        raise HTTPException(status_code=400, detail="Question must contain at least 4 characters")
    document = _get_document_or_404(request.document_id)
    return rag_service.answer_question(document, request.question, provider_name=get_settings().llm_provider)


@router.get("/pipeline/{job_id}", response_model=PipelineStatus)
def pipeline(job_id: str) -> PipelineStatus:
    return pipeline_service.get_status(job_id)


def _get_document_or_404(document_id: str) -> Document:
    try:
        return document_service.get_document(document_id)
    except DocumentNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Document not found") from exc
