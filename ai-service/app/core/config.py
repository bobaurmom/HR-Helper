from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "HR Helper AI Service"
    port: int = 8000


settings = Settings()
