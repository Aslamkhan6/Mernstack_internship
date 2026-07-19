import React from "react";

const SearchBar = ({ city, setCity, handleSearch, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 px-4">
      <input
        type="text"
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            handleSearch();
          }
        }}
        className="
          w-full
          sm:w-96
          px-5
          py-3
          border
          border-white/60
          rounded-lg
          outline-none
          focus:ring-2
          focus:ring-white
          transition
          duration-300
          text-gray-800
          placeholder-gray-400
          shadow-lg
          bg-white/90
        "
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={loading}
        className={`
          px-6
          py-3
          rounded-lg
          font-semibold
          shadow-lg
          transition
          ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5"
          }
        `}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
