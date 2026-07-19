import React from "react";

const ForecastCard = ({ forecast }) => {
  const forecastDate = forecast.date ? new Date(forecast.date) : null;
  const dayLabel =
    forecast.day ||
    (forecastDate
      ? forecastDate.toLocaleDateString("en-US", { weekday: "short" })
      : "Day");
  const dateLabel = forecastDate
    ? forecastDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : forecast.date;

  return (
    <div
      className="
        min-w-[180px]
        bg-white/15
        backdrop-blur-xl
        border
        border-white/20
        rounded-2xl
        p-5
        shadow-xl
        transition-all
        duration-300
        hover:bg-white/25
        hover:-translate-y-1
      "
    >
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{dayLabel}</h2>

        <p className="text-white/70 text-sm">{dateLabel}</p>
      </div>

      <div className="flex justify-center my-4">
        <img
          src={forecast.icon}
          alt={forecast.description}
          className="w-20 h-20"
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-black text-white">
          {Math.round(forecast.temperature)}°
        </h1>

        <p className="capitalize text-white/80 mt-2">
          {forecast.description}
        </p>
      </div>

      <div className="border-t border-white/20 my-4"></div>

      <div className="space-y-2 text-white text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-white/70">High</span>
          <span>{Math.round(forecast.max_temperature)}°</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-white/70">Low</span>
          <span>{Math.round(forecast.min_temperature)}°</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-white/70">Humidity</span>
          <span>{forecast.humidity}%</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-white/70">Wind</span>
          <span>{forecast.wind_speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
