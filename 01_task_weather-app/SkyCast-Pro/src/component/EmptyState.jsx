import React from "react";
import { FaSearchLocation } from "react-icons/fa";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center px-4">
      <FaSearchLocation className="text-7xl text-white drop-shadow-lg mb-5" />

      <h2 className="text-3xl font-bold text-white">Search for a City</h2>

      <p className="text-white/75 mt-3 max-w-md">
        Enter the name of any city to view its current weather, temperature,
        humidity, wind speed, and forecast.
      </p>
    </div>
  );
};

export default EmptyState;
