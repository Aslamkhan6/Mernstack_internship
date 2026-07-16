const weatherService = require("../services/weather_service")
 const getweather = async (req,res)=>{
try{

    const {city} = req.query;
    if(!city){
        return res.status(400).json({message :"City parameter is required"});
    }

    const weatherData = await weatherService.getcurrentweather(city);
    res.status(200).json({success: true, message :"Weather data fetched successfully", data: weatherData});
} catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message
    });
}
} 

module.exports = {getweather};