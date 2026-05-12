# Security Model

LegalDocs AI is a demo-ready prototype. Local mode uses mock role-based access control, but the repository includes a cloud-ready security design for a production implementation.

## Identity and Access

- Amazon Cognito would manage users, groups, password policies, MFA, and JWT issuance.
- Application roles map to legal reviewer, procurement reviewer, admin, and auditor personas.
- FastAPI middleware would validate JWTs and attach tenant, role, and permissions to each request.
- Admin-only endpoints would require explicit policy checks instead of UI-only gating.

## Encryption and KMS

- S3 contract objects should use KMS-backed server-side encryption.
- Tenant-sensitive metadata should be encrypted at rest in the metadata store.
- KMS key rotation is enabled in the CloudFormation scaffold.
- Secrets should be stored in AWS Secrets Manager or SSM Parameter Store, not environment files.

## Tenant Isolation

- Each document should carry a `tenant_id`, owner, retention policy, and classification label.
- API queries must filter by tenant and role before reading document text or vector chunks.
- Vector store namespaces should be tenant-scoped to prevent cross-tenant retrieval leakage.
- Audit logs should record document access, analysis runs, prompt construction, and export events.

## Demo Scope

The local demo intentionally uses in-memory storage and mock RBAC so recruiters can run it quickly. The security docs and infrastructure templates show how the prototype would evolve into a hardened cloud service.
