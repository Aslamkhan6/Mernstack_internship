import React from "react";

const SearchBar = ({city, setCity}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 px-4">
      <input
        type="text"
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      
        className="w-full sm:w-96 px-5 py-3 border-2 border-sky-400 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-300 text-gray-700 placeholder-gray-400 shadow-md"
      />

      <button
        className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 active:scale-95 transition duration-300 shadow-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;