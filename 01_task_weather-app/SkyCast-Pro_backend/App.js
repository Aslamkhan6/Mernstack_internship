const express = require("express");
const cors = require("cors");
require("dotenv").config();

const weatherRoutes = require("./routes/weather_routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/weather", weatherRoutes);

module.exports = app;