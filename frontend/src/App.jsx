import { useState } from "react";
import MovieCard from "../components/MovieCard";


function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden">

      {/* Background Blur */}
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-purple-600/30 blur-[120px]" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative z-10">

        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            AI Powered Recommendation Engine
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Next Favorite Movie
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-slate-300 text-lg">
            Search a movie you love and get intelligent recommendations
            based on content similarity.
          </p>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-6">
          <div className="relative max-w-4xl mx-auto">
            <div className="flex gap-4 p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
              <input
                type="text"
                value={movie}
                onChange={(e) => setMovie(e.target.value)}
                placeholder="Search Avatar, Interstellar, Inception..."
                className="flex-1 bg-transparent px-6 py-4 outline-none text-lg"
              />

              <button
                onClick={handleSearch}
                className="px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 font-semibold hover:scale-105 transition"
              >
                Discover
              </button>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-16">
            <div className="h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <section className="container mx-auto px-6 py-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              Recommended Movies
            </h2>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;