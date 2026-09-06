# Movie Recommender System

A full-stack movie recommendation application that suggests similar movies based on a selected title. The project combines a FastAPI backend, a React frontend, and a precomputed movie similarity model to deliver personalized recommendations from a movie database.

## Overview

This application allows users to enter a movie title and receive a curated list of recommendations based on content similarity. The backend loads a movie dataset and a precomputed similarity matrix, then fetches detailed metadata for each recommended movie from The Movie Database (TMDB) API.

The frontend provides a modern, responsive UI where users can search for movies and view a card-based list of recommendations with posters, ratings, genres, runtime, and summaries.

## Features

- Search for any movie title in the dataset
- Get top 5 similar movie recommendations
- Display movie metadata including:
  - title
  - tagline
  - overview
  - rating
  - vote count
  - runtime
  - release year
  - genres
  - poster image
- FastAPI REST API with health and recommendation endpoints
- React + Vite frontend with modern UI styling
- Docker support for easy local deployment
- Production-ready frontend build for static hosting

## Tech Stack

### Backend
- Python 3.12
- FastAPI
- Uvicorn
- Pydantic
- scikit-learn / joblib
- TMDB API integration

### Frontend
- React 19
- Vite
- JavaScript (JSX)
- Tailwind CSS (configured in the project)

### Deployment / DevOps
- Docker
- Docker Compose
- Nginx for frontend production container

## Project Architecture

```text
movie-recommender-system/
├── backend/
│   ├── models/
│   │   ├── recommend.py
│   │   └── similarity.joblib
│   ├── schema/
│   │   └── movie_input.py
│   ├── .env
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   ├── tmdb_5000_credits.csv
│   └── tmdb_5000_movies.csv
├── frontend/
│   ├── components/
│   │   └── MovieCard.jsx
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.production
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── public/
├── compose.yaml
├── .gitignore
└── README.md
```

## How It Works

1. The user types a movie title in the frontend.
2. The frontend sends a POST request to the backend API at `/recommend`.
3. The backend checks whether the movie exists in the movie dataset.
4. A similarity score matrix is used to find the most similar titles.
5. The API fetches additional metadata from TMDB for each recommended movie.
6. The frontend renders the recommendations as interactive cards.

## Backend API

### Base URL
- Local: `http://localhost:8000`

### Endpoints

#### `GET /`
Returns a welcome message.

#### `GET /health`
Returns the health status and model version.

Example response:

```json
{
  "status": "OK",
  "version": "1.0.0"
}
```

#### `POST /recommend`
Returns movie recommendations for a supplied movie title.

Request body:

```json
{
  "movie": "Inception"
}
```

Example response:

```json
{
  "success": true,
  "recommendations": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "A thief who steals corporate secrets through dream-sharing technology...",
      "tagline": "Your mind is the scene of the crime.",
      "release_date": "2010-07-16",
      "runtime": 148,
      "rating": 8.4,
      "vote_count": 267000,
      "popularity": 84.4,
      "genres": ["Action", "Sci-Fi", "Thriller"],
      "poster": "https://image.tmdb.org/t/p/w500/..."
    }
  ]
}
```

## Local Setup

### Prerequisites

- Python 3.12 or newer
- Node.js 22 or newer
- npm
- Docker and Docker Compose (optional, recommended)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie-recommender-system
```

### 2. Backend Configuration

Create a `.env` file inside the `backend` folder:

```env
YOUR_API_KEY=your_tmdb_api_key
MODEL_VERSION=1.0.0
```

> You will need a valid TMDB API key to fetch detailed movie metadata.

Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Configuration

Create or update the `frontend/.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

## Running with Docker

From the project root:

```bash
docker compose up --build
```

This starts:
- backend on `http://localhost:8000`
- frontend on `http://localhost:3000`

To stop the containers:

```bash
docker compose down
```

## Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

The build output is generated in the `frontend/dist` folder.

## Notes

- The recommendation engine uses a precomputed similarity matrix stored in `backend/models/similarity.joblib`.
- The movie search is based on exact title matches in the dataset.
- If TMDB poster or metadata requests fail, the app may return incomplete information or no images.
- The project includes a note in the UI that TMDB access may be restricted in some regions, and using a VPN may help resolve those restrictions.

## Project Status

This project is a functional movie recommendation application with a modern UI and a deployed-style container setup. It is well-suited for learning, demo purposes, and further extension into a more advanced recommendation pipeline.

## Future Enhancements

- Add user authentication and personalized watchlists
- Support fuzzy matching for movie titles
- Improve recommendation logic with collaborative filtering
- Add caching for TMDB metadata requests
- Add unit and integration testing
- Deploy backend and frontend to cloud hosting

## License

This project is provided for educational and demonstration purposes. Please check the repository license, if any, before production use.
