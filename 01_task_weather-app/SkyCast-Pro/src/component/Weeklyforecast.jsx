import React from "react";
import ForecastCard from "./Forecastcard";

const WeeklyForecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          5-Day Forecast
        </h2>

        <p className="text-white/75 text-sm">Daily outlook at midday</p>
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <ForecastCard key={index} forecast={day} />
        ))}
      </div>

      <div className="md:hidden flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {forecast.map((day, index) => (
          <ForecastCard key={index} forecast={day} />
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
