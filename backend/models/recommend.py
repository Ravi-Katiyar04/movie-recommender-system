import os
import pickle
import requests
import joblib
from dotenv import load_dotenv

load_dotenv()


API_KEY = os.getenv("YOUR_API_KEY")
MODEL_VERSION = os.getenv("MODEL_VERSION")

movies = pickle.load(open("models/movies.pkl", "rb"))
similarity = joblib.load("models/similarity.joblib")

print("Models loaded successfully")
print(f"Movies: {len(movies)}")

def get_movie_details(movie_id):
    
    try:
        response = requests.get(
            f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US"
        )

        response.raise_for_status()

        data = response.json()

        return {
            "id": data.get("id"),
            "title": data.get("title"),
            "overview": data.get("overview"),
            "tagline": data.get("tagline"),
            "release_date": data.get("release_date"),
            "runtime": data.get("runtime"),
            "rating": round(data.get("vote_average", 0), 1),
            "vote_count": data.get("vote_count"),
            "popularity": data.get("popularity"),
            "genres": [genre["name"] for genre in data.get("genres", [])],

            "poster": (
                f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
                if data.get("poster_path")
                else None
            ),
        }

    except Exception as e:
        print(f"Error fetching movie {movie_id}: {e}")
        return None

def recommender(movie):
    
    filtered = movies[movies["title"] == movie]

    if filtered.empty:
        raise ValueError(f"Movie '{movie}' not found")

    movie_index = filtered.index[0]

    distances = similarity[movie_index]


    movie_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:7]


    recommendations = []

    for i in movie_list:
        movie_id = movies.iloc[i[0]].id


        details = get_movie_details(int(movie_id))


        recommendations.append(details)


    return recommendations