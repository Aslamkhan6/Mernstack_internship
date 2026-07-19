const express = require("express")
const router = express.Router()
const {getweather} = require("../controller/weather_controller")
const {weeklyforcaste} = require("../controller/forcaste_weather_controller")

router.route("/").get(getweather)
router.route("/forecast").get(weeklyforcaste)


module.exports = router
