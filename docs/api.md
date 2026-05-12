# API

Base URL locally: `http://localhost:8000`

## Health and Metrics

- `GET /health`: Returns service status.
- `GET /metrics`: Prometheus metrics endpoint.

## Documents

### `GET /api/dashboard/stats`

Returns dashboard metrics for the demo UI: document count, analyzed count, risk totals, processing latency, and active LLM provider.

### `GET /api/documents`

Lists sample and uploaded documents.

### `GET /api/documents/{document_id}`

Returns full document metadata and text.

### `POST /api/documents/upload`

Uploads a `.txt` contract as `multipart/form-data` with field name `file`.

## Analysis

### `POST /api/contracts/analyze`

Request:

```json
{
  "document_id": "sample-msa"
}
```

Response includes summary, overall risk, clause findings, and recommendations.

## Compare

### `POST /api/contracts/compare`

Request:

```json
{
  "document_a_id": "sample-msa",
  "document_b_id": "sample-vendor"
}
```

Response includes executive summary and clause-by-clause risk deltas.

## Chat

### `POST /api/chat/query`

Request:

```json
{
  "document_id": "sample-msa",
  "question": "What is the termination notice period?",
  "role": "legal_reviewer"
}
```

Response includes answer, citations, retrieval context, and model provider.

## Pipeline

### `GET /api/pipeline/{job_id}`

Returns processing stages:

`Uploaded -> OCR Extracted -> Chunked -> Embedded -> Retrieved -> Summarized -> Completed`
