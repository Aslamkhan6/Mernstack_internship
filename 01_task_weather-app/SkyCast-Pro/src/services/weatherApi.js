import axios from "axios"
const API = axios.create(
    {
        
        baseURL:"http://localhost:5000/api/"
    }
);

export const weatherapi = async(city)=>{
    try {
    const response = await API.get(`/weather?city=${city}`);
    console.log("request recieved to api")
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const weeklyForecastApi = async (city) => {
    try {
    const response = await API.get(`/weather/forecast?city=${city}`);
    console.log("request recieved to api")
    return response.data;
  } catch (error) {
    throw error;
  }
  
}