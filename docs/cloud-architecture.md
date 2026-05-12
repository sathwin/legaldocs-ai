# Cloud Architecture

The cloud design uses AWS-style managed services and is represented by CloudFormation templates under `infra/cloudformation`.

## Core Services

- S3 stores uploaded contracts, extracted text, and generated analysis artifacts.
- KMS encrypts contracts and sensitive metadata.
- Cognito handles user identity, groups, MFA, and JWT issuance.
- SQS buffers ingestion jobs.
- Lambda handles lightweight event transforms and metadata enrichment.
- Step Functions orchestrates OCR, chunking, embedding, clause analysis, and notifications.
- ECS runs the FastAPI API, frontend container, and heavier workers.
- Prometheus and Grafana provide operational visibility in local mode; production could use Amazon Managed Prometheus and CloudWatch.

## Deployment Flow

1. CI builds and tests frontend/backend.
2. Container images are pushed to a registry.
3. CloudFormation provisions storage, identity, encryption, and workflow primitives.
4. ECS or Kubernetes deploys API, frontend, worker, Redis, and vector store services.
5. Ingestion events flow from S3 to queue/workflow processors.

## Prototype Boundary

The local repository is intentionally lightweight. It shows the architecture, contracts, and deployment surfaces without requiring real AWS credentials or paid model APIs.
