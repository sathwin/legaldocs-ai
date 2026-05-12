# RAG Layer

The current implementation uses `backend/app/services/rag.py`, a deterministic mock retrieval service that chunks contract text and ranks sections by question overlap.

Production upgrade path:

1. Replace `MockRetrievalService.chunk` with a token-aware splitter.
2. Add embedding generation using OpenAI, Azure OpenAI, Bedrock, or OpenRouter-compatible providers.
3. Persist vectors in FAISS, Chroma, OpenSearch, Pinecone, Weaviate, or pgvector.
4. Add citation spans and source offsets for reviewer-grade explainability.
5. Move ingestion to workers and keep chat/query online-only.
