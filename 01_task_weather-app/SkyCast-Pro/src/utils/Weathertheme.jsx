export const getWeatherTheme = (description = "") => {
  const weather = description.toLowerCase();

  // ☀️ Sunny
  if (weather.includes("clear")) {
    return {
      pageBackground:
        "bg-gradient-to-br from-yellow-200 via-orange-300 to-red-400",

      cardBackground:
        "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500",

      cardColor: "bg-white/20",

      textColor: "text-white",

      icon: "☀️",
    };
  }

  // ☁️ Cloudy
  if (weather.includes("cloud")) {
    return {
      pageBackground:
        "bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700",

      cardBackground:
        "bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800",

      cardColor: "bg-white/20",

      textColor: "text-white",

      icon: "☁️",
    };
  }

  // 🌧 Rain
  if (
    weather.includes("rain") ||
    weather.includes("drizzle")
  ) {
    return {
      pageBackground:
        "bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950",

      cardBackground:
        "bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900",

      cardColor: "bg-white/15",

      textColor: "text-white",

      icon: "🌧️",
    };
  }

  // ⛈ Thunder
  if (weather.includes("thunder")) {
    return {
      pageBackground:
        "bg-gradient-to-br from-black via-gray-900 to-purple-950",

      cardBackground:
        "bg-gradient-to-br from-purple-800 via-gray-900 to-black",

      cardColor: "bg-white/15",

      textColor: "text-white",

      icon: "⛈️",
    };
  }

  // ❄ Snow
  if (weather.includes("snow")) {
    return {
      pageBackground:
        "bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-200",

      cardBackground:
        "bg-gradient-to-br from-cyan-100 via-sky-200 to-blue-400",

      cardColor: "bg-white/50",

      textColor: "text-gray-900",

      icon: "❄️",
    };
  }

  // 🌫 Mist
  if (
    weather.includes("mist") ||
    weather.includes("fog") ||
    weather.includes("haze")
  ) {
    return {
      pageBackground:
        "bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600",

      cardBackground:
        "bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700",

      cardColor: "bg-white/20",

      textColor: "text-white",

      icon: "🌫️",
    };
  }

  // 🌤 Default
  return {
    pageBackground:
      "bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-500",

    cardBackground:
      "bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-800",

    cardColor: "bg-white/20",

    textColor: "text-white",

    icon: "🌤️",
  };
};