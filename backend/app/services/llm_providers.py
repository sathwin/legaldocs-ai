from abc import ABC, abstractmethod


class BaseLLMProvider(ABC):
    name: str

    @abstractmethod
    def complete(self, prompt: str, context: list[str]) -> str:
        """Return a completion for the supplied prompt and retrieval context."""


class MockLLMProvider(BaseLLMProvider):
    name = "mock"

    def complete(self, prompt: str, context: list[str]) -> str:
        primary_context = context[0] if context else "No relevant contract text was retrieved."
        return (
            f"Based on the retrieved contract sections, {primary_context[:420]}. "
            "This deterministic response keeps the demo reliable without external model credentials."
        )


class OpenAIProvider(BaseLLMProvider):
    name = "openai"

    def complete(self, prompt: str, context: list[str]) -> str:
        raise NotImplementedError("OpenAIProvider is a production placeholder. Add the OpenAI SDK and API key wiring here.")


class BedrockProvider(BaseLLMProvider):
    name = "bedrock"

    def complete(self, prompt: str, context: list[str]) -> str:
        raise NotImplementedError("BedrockProvider is a production placeholder. Add boto3 client invocation here.")


def get_llm_provider(provider_name: str | None) -> BaseLLMProvider:
    providers: dict[str, BaseLLMProvider] = {
        "mock": MockLLMProvider(),
        "openai": OpenAIProvider(),
        "bedrock": BedrockProvider(),
    }
    return providers.get((provider_name or "mock").lower(), providers["mock"])
