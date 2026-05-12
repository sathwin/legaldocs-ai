# Workers

This folder represents asynchronous document-processing workers for production deployments.

Planned responsibilities:

- PDF OCR with Textract, Tesseract, or Azure Document Intelligence
- Contract chunking and metadata enrichment
- Embedding creation and vector index updates
- Long-running clause extraction jobs
- Webhook notifications for completed reviews

The demo runs these stages synchronously through the FastAPI service so local setup stays simple.
