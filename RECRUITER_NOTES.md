# Recruiter Notes

## What This Project Demonstrates

LegalDocs AI demonstrates how I structure a realistic full-stack AI product prototype: a polished React/TypeScript frontend, a typed FastAPI backend, service-layer architecture, mock LLM/RAG integration, Docker, Kubernetes, CI/CD, monitoring, and cloud infrastructure scaffolding.

## Fully Working Parts

- React dashboard and contract analysis UI.
- Document selection and `.txt` upload flow.
- FastAPI endpoints for health, metrics, documents, analysis, comparison, chat, and pipeline status.
- Deterministic clause extraction and risk scoring.
- Mock RAG chat responses with citations and prompt preview.
- Contract comparison with side-by-side risk deltas.
- Docker Compose configuration for frontend, backend, Redis, worker, Prometheus, and Grafana.
- Backend tests and frontend production build.

## Simulated Parts

- LLM output is provided by `MockLLMProvider`.
- Vector search is simulated with paragraph chunking and keyword overlap.
- Redis and worker containers are scaffolds for production-style background processing.
- CloudFormation and Kubernetes files are credible templates, not a hardened production deployment.
- Frontend fallback mode is included so hosted demos remain useful if a free backend service is sleeping.

## Skill Mapping

Backend:
- FastAPI routing, Pydantic models, service-layer architecture, error handling, tests, health checks, metrics.

AI Engineering:
- RAG design, chunking strategy, retrieval abstraction, prompt construction, provider interface for OpenAI/Bedrock.

Cloud:
- AWS-style S3, Cognito, KMS, Lambda, Step Functions, ECS templates; deployment docs for Vercel and Render/Railway.

DevOps:
- Dockerfiles, Docker Compose, Kubernetes manifests, HPA, config maps, secret examples, GitHub Actions CI, Prometheus, Grafana.
