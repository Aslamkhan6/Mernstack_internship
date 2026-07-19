import React from "react";
import { getWeatherTheme } from "../utils/Weathertheme";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const theme = getWeatherTheme(weather.weather_description);

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <div
        className={`
          ${theme.cardBackground}
          ${theme.textColor}
          rounded-2xl
          shadow-[0_25px_80px_rgba(0,0,0,0.35)]
          border border-white/20
          backdrop-blur-xl
          p-8
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-[0_35px_90px_rgba(0,0,0,0.45)]
        `}
      >
        <div className="flex justify-center">
          <img
            src={weather.icon}
            alt={weather.weather_description}
            className="w-32 h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
          />
        </div>

        <div className="text-center mt-2">
          <h2 className="text-4xl font-extrabold tracking-wide">
            {weather.city}
          </h2>

          <p className="uppercase tracking-[5px] opacity-80 mt-2 text-sm">
            {weather.country}
          </p>
        </div>

        <div className="text-center mt-8">
          <h1 className="text-8xl font-black leading-none">
            {Math.round(weather.temperature)}°
          </h1>

          <p className="capitalize text-xl mt-3 opacity-90">
            {weather.weather_description}
          </p>
        </div>

        <div className="w-full h-px bg-white/30 my-8"></div>

        <div className="grid grid-cols-2 gap-5">
          <div
            className={`
              ${theme.cardColor}
              backdrop-blur-lg
              border border-white/20
              rounded-lg
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
            `}
          >
            <p className="text-sm opacity-80">Feels Like</p>

            <h3 className="text-2xl font-bold mt-1">
              {Math.round(weather.feels_like)}°
            </h3>
          </div>

          <div
            className={`
              ${theme.cardColor}
              backdrop-blur-lg
              border border-white/20
              rounded-lg
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
            `}
          >
            <p className="text-sm opacity-80">Humidity</p>

            <h3 className="text-2xl font-bold mt-1">{weather.humidity}%</h3>
          </div>

          <div
            className={`
              ${theme.cardColor}
              backdrop-blur-lg
              border border-white/20
              rounded-lg
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
            `}
          >
            <p className="text-sm opacity-80">Wind Speed</p>

            <h3 className="text-2xl font-bold mt-1">
              {weather.wind_speed} m/s
            </h3>
          </div>

          <div
            className={`
              ${theme.cardColor}
              backdrop-blur-lg
              border border-white/20
              rounded-lg
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
            `}
          >
            <p className="text-sm opacity-80">Pressure</p>

            <h3 className="text-2xl font-bold mt-1">
              {weather.pressure} hPa
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
