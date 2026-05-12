import re

from app.models.schemas import ChatResponse, Document
from app.services.llm_providers import get_llm_provider


class RagService:
    def chunk(self, content: str) -> list[str]:
        chunks = [chunk.strip() for chunk in re.split(r"\n\s*\n", content) if chunk.strip()]
        return chunks or [content[:1000]]

    def retrieve(self, document: Document, question: str, top_k: int = 3) -> list[str]:
        question_terms = {term.lower() for term in re.findall(r"[a-zA-Z]{4,}", question)}
        scored = []
        for chunk in self.chunk(document.content):
            words = set(re.findall(r"[a-zA-Z]{4,}", chunk.lower()))
            scored.append((len(words & question_terms), chunk))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [chunk for _, chunk in scored[:top_k]]

    def answer_question(self, document: Document, question: str, provider_name: str) -> ChatResponse:
        contexts = self.retrieve(document, question)
        prompt = self.build_prompt(question, contexts)
        provider = get_llm_provider(provider_name)
        answer = provider.complete(prompt, contexts)
        return ChatResponse(
            answer=answer,
            citations=[f"{document.name} :: retrieved chunk {index + 1}" for index in range(len(contexts))],
            retrieval_context=contexts,
            model_provider=provider.name,
            prompt_preview=prompt[:500],
        )

    @staticmethod
    def build_prompt(question: str, contexts: list[str]) -> str:
        joined_context = "\n\n---\n\n".join(contexts)
        return (
            "You are a legal contract analysis assistant. Answer only from retrieved context, "
            "cite the relevant clause, and flag uncertainty.\n\n"
            f"Question: {question}\n\nRetrieved context:\n{joined_context}"
        )


rag_service = RagService()
