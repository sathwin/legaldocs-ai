# Deployment

LegalDocs AI is designed for reliable recruiter demos. The recommended hosted setup is Vercel for the frontend and Render or Railway for the backend. Redis and background workers are optional in demo mode.

## Local Development

```bash
make install
make backend
make frontend
```

Open:

- Frontend: `http://localhost:5173`
- Backend docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

## Docker Compose

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` with `admin/admin`
- Redis: `localhost:6379`

## Vercel Frontend

Set project root to `frontend`.

Build settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Environment variables:

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_ENABLE_DEMO_FALLBACK=true
```

Fallback mode allows the UI to show realistic sample data if the backend is temporarily asleep or unavailable.

## Render Backend

Use the included `render.yaml` or create a Docker web service with root directory `backend`.

Health check path:

```text
/health
```

Environment variables:

```bash
LEGALDOCS_DEMO_MODE=true
LEGALDOCS_LLM_PROVIDER=mock
LEGALDOCS_CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173,http://localhost:3000
```

## Railway Backend

Create a service from the repository and point it at the backend Dockerfile.

Recommended variables:

```bash
LEGALDOCS_DEMO_MODE=true
LEGALDOCS_LLM_PROVIDER=mock
LEGALDOCS_CORS_ORIGINS=https://your-vercel-app.vercel.app
PORT=8000
```

The backend container exposes port `8000`.

## Redis and Workers

The local Docker Compose stack includes Redis and a demo worker. Hosted demos can skip Redis entirely because the API uses deterministic local services. For a more realistic hosted environment, use Upstash Redis and set:

```bash
REDIS_URL=rediss://...
VECTOR_STORE_URL=https://...
```

## Kubernetes

The `/k8s` directory contains deployment scaffolding:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.example.yaml
kubectl apply -f k8s/
```

Update image names and ingress hostnames before deploying to a real cluster.

## Cloud Infrastructure

CloudFormation templates in `infra/cloudformation/` cover:

- S3 and KMS for encrypted document storage,
- Cognito for identity and RBAC,
- SQS, Lambda, and Step Functions for ingestion workflows,
- ECS for API and worker containers.

These files are production-style scaffolding for portfolio review, not fully hardened production infrastructure.
