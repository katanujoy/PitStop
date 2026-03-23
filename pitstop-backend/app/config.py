from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = "sqlite:///./test.db"
    secret_key: str = "your-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=525600)

    class Config:
        env_file = ".env"

settings = Settings()
