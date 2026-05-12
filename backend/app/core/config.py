from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="LEGALDOCS_")

    app_name: str = "LegalDocs AI"
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    deployed_frontend_url: str | None = None
    demo_mode: bool = True
    llm_provider: str = "mock"
    llm_api_key: str | None = None

    @property
    def allowed_origins(self) -> list[str]:
        origins = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        if self.deployed_frontend_url:
            origins.append(self.deployed_frontend_url.rstrip("/"))
        return sorted(set(origins))


@lru_cache
def get_settings() -> Settings:
    return Settings()
