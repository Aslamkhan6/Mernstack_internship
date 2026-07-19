const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.WEATHER_API_KEY;


const getcurrentweather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    return {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      weather_description: response.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching current weather"
    );
  }
};



const getweeklyforcaste = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    return response.data;
  } catch (error) {
   throw new Error(
  error.response?.data?.message ||
  "Error fetching weekly forecast"
);
  }
};

module.exports = {
  getcurrentweather,
  getweeklyforcaste,
};
