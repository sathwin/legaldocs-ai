# RAG Design

LegalDocs AI uses a deterministic local retrieval simulation for the demo. The design mirrors a production RAG architecture while avoiding external API keys.

## Ingestion

1. Upload document.
2. Extract text. The local demo supports `.txt`; PDF OCR is reserved for worker integration.
3. Normalize clauses and metadata.
4. Split the contract into clause-aware chunks.
5. Generate embeddings.
6. Store vectors with tenant, document, clause, and page metadata.

## Chunking

The demo chunks on paragraph boundaries. A production version should use token-aware splitting, preserve clause headings, and store offsets for citation rendering.

## Embeddings and Vector Store

Production providers could include OpenAI, Azure OpenAI, Bedrock Titan, or Cohere embeddings. Storage could be FAISS, Chroma, OpenSearch, pgvector, Pinecone, or Weaviate.

## Retrieval and Reranking

The local `RagService` ranks chunks by question-term overlap. A production service would:

- retrieve top-k vector matches,
- apply metadata filters for tenant and document authorization,
- rerank with a cross-encoder or LLM reranker,
- deduplicate near-identical clauses,
- return citation-ready spans.

## Prompt Construction

Prompts should include role, task, retrieved context, citation requirements, uncertainty instructions, and policy constraints. The mock provider returns deterministic answers, while `OpenAIProvider` and `BedrockProvider` are placeholders for real model calls.
