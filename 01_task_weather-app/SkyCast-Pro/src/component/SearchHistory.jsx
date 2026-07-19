import React from "react";

const SearchHistory = ({ history, onSelectCity }) => {
  if (history.length === 0) return null;

  const formatTime = (time) => {
    const date = new Date(time);

    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Recent Searches
        </h2>

        <span className="text-white/70 text-sm">
          {history.length} saved
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {history.map((data, index) => (
          <button
            type="button"
            key={`${data.city}-${data.searchedAt}-${index}`}
            onClick={() => onSelectCity(data.city)}
            className="
              text-left
              rounded-2xl
              p-6
              bg-white/15
              backdrop-blur-xl
              border
              border-white/20
              shadow-xl
              hover:bg-white/20
              hover:-translate-y-1
              transition-all
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-white
            "
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{data.city}</h2>

                <p className="text-white/70">{data.country}</p>
              </div>

              <img
                src={data.icon}
                alt={data.description}
                className="w-16 h-16"
              />
            </div>

            <div className="mt-4">
              <h1 className="text-5xl font-black text-white">
                {Math.round(data.temperature)}°
              </h1>

              <p className="capitalize text-base text-white/80 mt-2">
                {data.description}
              </p>
            </div>

            <div className="border-t border-white/20 my-5"></div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-xs">Feels Like</p>

                <h3 className="text-xl font-bold text-white">
                  {Math.round(data.feels_like)}°
                </h3>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-xs">Humidity</p>

                <h3 className="text-xl font-bold text-white">
                  {data.humidity}%
                </h3>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-xs">Wind</p>

                <h3 className="text-xl font-bold text-white">
                  {data.wind_speed} m/s
                </h3>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-xs">Pressure</p>

                <h3 className="text-xl font-bold text-white">
                  {data.pressure} hPa
                </h3>
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs text-white/60">
                {formatTime(data.searchedAt)}
              </span>

              <span className="rounded-lg bg-sky-500/80 px-4 py-2 text-white text-sm font-semibold">
                View
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
