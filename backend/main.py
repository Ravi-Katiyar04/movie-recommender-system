from fastapi import FastAPI
import traceback
from fastapi.middleware.cors import CORSMiddleware
from models.recommend import recommender, get_movie_details, get_movie_suggestions, MODEL_VERSION
from schema.movie_input import MovieRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to the Movie Recommendation API"}

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "version": MODEL_VERSION
    }


@app.get("/search")
def search_movies(q: str = "", limit: int = 8):
    try:
        suggestions = get_movie_suggestions(q, limit)
        return {
            "success": True,
            "query": q,
            "suggestions": suggestions
        }
    except Exception as e:
        traceback.print_exc()
        return {
            "success": False,
            "message": str(e),
            "suggestions": []
        }


@app.post("/recommend")
def get_recommendations(request: MovieRequest):
    try:
        result = recommender(request.movie)

        return {
            "success": True,
            "recommendations": result
        }

    except Exception as e:
        traceback.print_exc()

        return {
            "success": False,
            "message": str(e)
        }