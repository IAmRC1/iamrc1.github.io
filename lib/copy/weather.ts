export const NAV_WEATHER_COPY = {
  temperatureUnit: "C",
  describeTemp: (tempC: number) => {
    if (tempC <= 10) return "it's chilly out there";
    if (tempC <= 18) return "it's cool out there";
    if (tempC <= 28) return "it's nice out there";
    return "it's hot out there";
  },
} as const;

export const DISTANCE_WEATHER_COPY = {
  title: "Location + Weather",
  intro:
    "If you choose, I'll use your location once to calculate how far you are from my location and show local weather. Your location is not stored.",
  buttons: {
    shareLocation: "Share location",
    notNow: "Not now",
    tryAgain: "Try again",
    close: "Close",
  },
  status: {
    requestingLocation: "Requesting your location…",
    fetchingWeather: "Fetching your local weather…",
    geolocationUnsupported: "Geolocation is not supported in this browser.",
    couldNotAccess:
      "Could not access your location. Please allow permission and try again.",
    couldntLoadTitle: "Couldn't load",
  },
  results: {
    title: "Results",
    distanceToPrefix: "Distance to",
    distanceUnknown: "—",
    distanceUnit: "km",
    yourTemperaturePrefix: "Your temperature:",
    weatherAriaLabel: "weather",
    weatherTitle: "Weather",
    weatherUnavailable: "Weather: unavailable right now",
  },
} as const;
