const axios = require("axios")
const dotenv = require("dotenv");
dotenv.config();
const getcurrentweather = async (city)=>{
    try{
        const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
                q: city,
                appid: process.env.WEATHER_API_KEY,
                units: "metric"
            }
        });
        data = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: response.data.main.temp,
            feels_like: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            wind_speed: response.data.wind.speed,
            weather_description: response.data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
        };
        return data;
    }catch (error) {
        throw new Error({message: "Error fetching weather data",error:error.response.data.message||error.message});
    }
}


module.exports = {getcurrentweather}