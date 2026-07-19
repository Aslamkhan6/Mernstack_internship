import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import SearchBar from "../component/SearchBar";
import WeatherCard from "../component/WeatherCard";
import Loading from "../component/Loader";
import EmptyState from "../component/EmptyState";
import ErrorCard from "../component/Error";
import SearchHistory from "../component/SearchHistory";
import WeeklyForecast from "../component/Weeklyforecast";

import { weatherapi, weeklyForecastApi } from "../services/weatherApi";
import { getWeatherTheme } from "../utils/Weathertheme";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);
  const [forecastError, setForecastError] = useState("");
  const [showForecast, setShowForecast] = useState(false);

  const [searchHistory, setSearchHistory] = useState(() => {
    const savedHistory = localStorage.getItem("weatherHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const hasWeather = !!weather;
  const hasError = !!error;
  const isLoading = loading;

  const theme = weather
    ? getWeatherTheme(weather.weather_description)
    : getWeatherTheme();

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    await searchCity(city);
  };

  const searchCity = async (selectedCity) => {
    try {
      setError("");
      setLoading(true);
      setWeather(null);
      setForecast([]);
      setForecastError("");
      setShowForecast(false);

      const currentWeatherResponse = await weatherapi(selectedCity);
      setWeather(currentWeatherResponse.data);

      try {
        const forecastResponse = await weeklyForecastApi(selectedCity);
        setForecast(forecastResponse.data || []);
      } catch {
        setForecast([]);
        setForecastError("Weekly forecast is unavailable right now.");
      }

      const historyItem = {
        city: currentWeatherResponse.data.city,
        country: currentWeatherResponse.data.country,
        temperature: currentWeatherResponse.data.temperature,
        feels_like: currentWeatherResponse.data.feels_like,
        humidity: currentWeatherResponse.data.humidity,
        pressure: currentWeatherResponse.data.pressure,
        wind_speed: currentWeatherResponse.data.wind_speed,
        description: currentWeatherResponse.data.weather_description,
        icon: currentWeatherResponse.data.icon,
        searchedAt: new Date().toISOString(),
      };

      setSearchHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.city.toLowerCase() !== historyItem.city.toLowerCase()
        );

        return [historyItem, ...filtered].slice(0, 5);
      });

      setCity("");
    } catch (error) {
      setWeather(null);
      setForecast([]);
      setForecastError("");
      setShowForecast(false);

      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        min-h-screen
        transition-all
        duration-700
        pb-14
        ${theme.pageBackground}
      `}
    >
      <Navbar />

      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
        loading={isLoading}
      />

      {!isLoading && !hasError && !hasWeather && <EmptyState />}

      {isLoading && <Loading />}

      {hasError && <ErrorCard message={error} />}

      {!isLoading && !hasError && hasWeather && <WeatherCard weather={weather} />}

      {!isLoading && !hasError && hasWeather && forecast.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 px-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowForecast((prev) => !prev)}
            className="
              rounded-lg
              bg-white/90
              px-5
              py-3
              text-sm
              font-bold
              text-slate-800
              shadow-lg
              border
              border-white/40
              transition
              hover:bg-white
              hover:-translate-y-0.5
              focus:outline-none
              focus:ring-2
              focus:ring-white
              focus:ring-offset-2
              focus:ring-offset-sky-700
            "
          >
            {showForecast ? "Hide weekly forecast" : "Show weekly forecast"}
          </button>
        </div>
      )}

      {!isLoading && !hasError && hasWeather && forecastError && (
        <p className="mt-5 text-center text-sm font-medium text-white/80">
          {forecastError}
        </p>
      )}

      {!isLoading && !hasError && showForecast && forecast.length > 0 && (
        <WeeklyForecast forecast={forecast} />
      )}

      {!isLoading && (
        <SearchHistory history={searchHistory} onSelectCity={searchCity} />
      )}
    </div>
  );
};

export default Home;
