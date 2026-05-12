# Architecture

LegalDocs AI is a demo-ready contract intelligence platform designed to look and behave like a production SaaS system while remaining simple enough to run locally.

## System Context

```text
React/Tailwind UI
  -> FastAPI API
    -> Document Store
    -> Clause/Risk Analyzer
    -> Mock Retrieval Service
    -> Pipeline Status Service
  -> Prometheus Metrics
  -> Grafana Dashboard
```

## Runtime Components

- `frontend`: React + TypeScript single page application served by Vite locally and Nginx in Docker.
- `backend`: FastAPI service exposing document, dashboard, analysis, compare, chat, health, and metrics endpoints.
- `services`: document, analysis, RAG, comparison, pipeline, and LLM provider boundaries.
- `rag`: Retrieval abstraction currently implemented as local deterministic text chunking and keyword ranking.
- `workers`: Placeholder boundary for asynchronous OCR, embedding, and long-running analysis jobs.
- `monitoring`: Prometheus scrape config and Grafana dashboard.
- `infra/cloudformation`: AWS-style placeholders for S3, Cognito, Lambda, Step Functions, ECS, and KMS.
- `k8s`: Kubernetes namespace, deployments, services, ingress, HPA, config map, and secret example.

## Data Flow

1. A user uploads a `.txt` contract or selects a sample contract.
2. FastAPI stores contract text in an in-memory demo store.
3. The analyzer extracts six clause categories and assigns risk levels.
4. The retrieval service chunks the document and selects relevant sections for chat answers.
5. Pipeline status returns a deterministic stage trail for the UI.
6. Prometheus scrapes `/metrics` for request counts and latency.

## Production Upgrade Path

- Replace in-memory storage with S3 metadata in Postgres or DynamoDB.
- Move ingestion stages to queue-backed workers.
- Add OCR through Textract, Azure Document Intelligence, or Tesseract.
- Swap mock retrieval for embeddings plus FAISS, Chroma, OpenSearch, or pgvector.
- Add real auth using Cognito, Auth0, or Entra ID.
- Implement the included OpenAI and Bedrock provider placeholders.
