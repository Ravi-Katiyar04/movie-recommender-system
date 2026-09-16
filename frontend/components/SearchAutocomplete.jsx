import { useState, useEffect, useRef } from "react";

function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  onSearch,
  placeholder = "Search Avatar, Interstellar, Inception...",
  disabled = false,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced API fetch for suggestions
  useEffect(() => {
    const trimmedQuery = value.trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(
          `${apiUrl}/search?q=${encodeURIComponent(trimmedQuery)}&limit=8`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions || []);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Autocomplete fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen && e.key === "ArrowDown") {
      if (suggestions.length > 0) setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        selectSuggestion(suggestions[highlightedIndex].title);
      } else {
        setIsOpen(false);
        onSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const selectSuggestion = (title) => {
    onChange(title);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect(title);
  };

  const clearInput = () => {
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Helper to highlight matched query substring inside title
  const renderHighlightedTitle = (title) => {
    if (!value.trim()) return title;
    const query = value.trim();
    const index = title.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) return title;

    const before = title.slice(0, index);
    const match = title.slice(index, index + query.length);
    const after = title.slice(index + query.length);

    return (
      <>
        {before}
        <span className="font-bold text-cyan-400 bg-cyan-500/10 px-0.5 rounded">
          {match}
        </span>
        {after}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all shadow-lg">
        {/* Search Icon */}
        <div className="pl-4 text-slate-400 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-cyan-400/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (value.trim() && suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent py-4 outline-none text-lg text-white placeholder-slate-400"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />

        {/* Loading Spinner or Clear Button */}
        {loading ? (
          <div className="pr-2">
            <div className="h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          value && (
            <button
              type="button"
              onClick={clearInput}
              aria-label="Clear search input"
              className="p-2 mr-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )
        )}

        {/* Discover Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            onSearch();
          }}
          disabled={disabled}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 font-semibold hover:scale-105 active:scale-95 transition shadow-md hover:shadow-cyan-500/25 shrink-0"
        >
          Discover
        </button>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-3 py-2 bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {suggestions.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
              {suggestions.map((item, index) => {
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={item.id || index}
                    onClick={() => selectSuggestion(item.title)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-5 py-3.5 cursor-pointer flex items-center gap-3 transition-colors duration-150 ${
                      isHighlighted
                        ? "bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-transparent text-cyan-200 border-l-4 border-cyan-400 pl-4"
                        : "text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {/* Movie Clapper Icon */}
                    <span className="text-slate-400 text-sm">🎬</span>
                    <span className="flex-1 text-base font-medium truncate">
                      {renderHighlightedTitle(item.title)}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400">
                      Select ↵
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-4 text-center text-slate-400 text-sm">
              No matching movies found for &quot;<span className="text-cyan-300 font-medium">{value}</span>&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;
