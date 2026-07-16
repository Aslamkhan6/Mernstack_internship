const express = require("express")
const router = express.Router()
const {getweather} = require("../controller/weather_controller")


router.route("/").get(getweather)

module.exports = router
