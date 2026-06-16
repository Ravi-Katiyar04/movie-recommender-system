function MovieCard({ movie }) {

  const formatRuntime = (minutes) => {

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        hover:border-cyan-400/40
        transition-all
        duration-500
        hover:-translate-y-3
        hover:shadow-2xl
        hover:shadow-cyan-500/20
      "
    >
      {/* Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute top-4 right-4">
          <div className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">
            ⭐ {movie.rating}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">
          {movie.title}
        </h3>

        <p className="text-cyan-300 text-sm italic mb-4">
          {movie.tagline}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div>
            <p className="text-slate-400">Runtime</p>
            <p>{formatRuntime(movie.runtime)}</p>
          </div>

          <div>
            <p className="text-slate-400">Votes</p>
            <p>{movie.vote_count?.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-slate-400">Year</p>
            <p>{movie.release_date?.slice(0, 4)}</p>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="
                px-3
                py-1
                rounded-full
                text-xs
                bg-cyan-500/10
                border border-cyan-500/20
                text-cyan-300
              "
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Overview */}
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;