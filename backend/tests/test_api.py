from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_analyze_sample_contract() -> None:
    response = client.post("/api/contracts/analyze", json={"document_id": "sample-msa"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["document_id"] == "sample-msa"
    assert len(payload["clauses"]) == 6
    assert payload["sample_output"]["reviewer_status"] == "Ready for legal review"


def test_chat_query() -> None:
    response = client.post(
        "/api/chat/query",
        json={"document_id": "sample-msa", "question": "What is the termination notice period?"},
    )
    assert response.status_code == 200
    assert response.json()["citations"]


def test_dashboard_stats() -> None:
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    assert response.json()["total_documents"] >= 2


def test_compare_sample_contracts() -> None:
    response = client.post(
        "/api/contracts/compare",
        json={"document_a_id": "sample-msa", "document_b_id": "sample-vendor"},
    )
    assert response.status_code == 200
    assert len(response.json()["differences"]) == 6


def test_upload_rejects_unsupported_file() -> None:
    response = client.post("/api/documents/upload", files={"file": ("contract.pdf", b"fake", "application/pdf")})
    assert response.status_code == 400


def test_pipeline_status() -> None:
    response = client.get("/api/pipeline/job-sample-msa")
    assert response.status_code == 200
    assert response.json()["status"] == "Completed"
