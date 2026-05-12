from datetime import UTC, datetime
from uuid import uuid4

from app.models.schemas import DashboardStats, Document, DocumentSummary
from app.services.sample_data import SAMPLE_CONTRACTS


class DocumentNotFoundError(Exception):
    pass


class UnsupportedDocumentError(Exception):
    pass


class DocumentService:
    def __init__(self) -> None:
        self._documents: dict[str, Document] = {doc.id: doc for doc in SAMPLE_CONTRACTS}

    def list_documents(self) -> list[DocumentSummary]:
        return [self.to_summary(document) for document in self._documents.values()]

    def get_document(self, document_id: str) -> Document:
        document = self._documents.get(document_id)
        if not document:
            raise DocumentNotFoundError(f"Document {document_id} was not found")
        return document

    def upload_text_document(self, name: str, content: str) -> DocumentSummary:
        if not name.lower().endswith(".txt"):
            raise UnsupportedDocumentError("Only .txt uploads are enabled in the demo")
        if not content.strip():
            raise UnsupportedDocumentError("Uploaded document is empty")

        document_id = f"doc-{uuid4().hex[:10]}"
        document = Document(
            id=document_id,
            name=name,
            content=content,
            created_at=datetime.now(UTC).isoformat(),
            tags=["uploaded", "demo", "txt"],
            job_id=f"job-{uuid4().hex[:10]}",
        )
        self._documents[document.id] = document
        return self.to_summary(document)

    def dashboard_stats(self, provider: str) -> DashboardStats:
        return DashboardStats(
            total_documents=len(self._documents),
            analyzed_documents=len(self._documents),
            high_risk_clauses=4,
            medium_risk_clauses=8,
            average_processing_ms=1435,
            provider=provider,
        )

    @staticmethod
    def to_summary(document: Document) -> DocumentSummary:
        return DocumentSummary(
            id=document.id,
            name=document.name,
            created_at=document.created_at,
            tags=document.tags,
            job_id=document.job_id,
        )


document_service = DocumentService()
