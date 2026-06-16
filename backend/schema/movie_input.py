from pydantic import BaseModel, field_validator

class MovieRequest(BaseModel):
    movie: str

    @field_validator("movie", mode="before")
    def convert_to_title(cls, v: str) -> str:
        return v.strip().title()
   