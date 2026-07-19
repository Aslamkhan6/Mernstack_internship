const weatherServices = require("../services/weather_service");

const weeklyforcaste = async (req, res) => {
  try {

    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City parameter is required",
      });
    }

    const response = await weatherServices.getweeklyforcaste(city);

    // response.list contains 40 forecast records
    const forecast = response.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .map((item) => ({
        date: item.dt_txt.split(" ")[0],

        temperature: item.main.temp,

        min_temperature: item.main.temp_min,

        max_temperature: item.main.temp_max,

        humidity: item.main.humidity,

        pressure: item.main.pressure,

        wind_speed: item.wind.speed,

        description: item.weather[0].description,

        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      }));

    res.status(200).json({
      success: true,
      message: "Weekly forecast fetched successfully",
      data: forecast,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  weeklyforcaste,
};