// ─────────────────────────────────────────────────────────────────────────────
// WeatherAPI condition code → wk_condition
// ─────────────────────────────────────────────────────────────────────────────

const CODE_TO_WK_CONDITION = {
  1000: "clear",
  1003: "partlyCloudy",
  1006: "mostlyCloudy",
  1009: "cloudy",
  1030: "haze",
  1063: "rain",
  1066: "flurries",
  1069: "sleet",
  1072: "freezingDrizzle",
  1087: "isolatedThunderstorms",
  1114: "blowingSnow",
  1117: "blizzard",
  1135: "foggy",
  1147: "foggy",
  1150: "drizzle",
  1153: "drizzle",
  1168: "freezingDrizzle",
  1171: "freezingDrizzle",
  1180: "rain",
  1183: "rain",
  1186: "rain",
  1189: "rain",
  1192: "heavyRain",
  1195: "heavyRain",
  1198: "freezingRain",
  1201: "freezingRain",
  1204: "sleet",
  1207: "sleet",
  1210: "flurries",
  1213: "snow",
  1216: "snow",
  1219: "snow",
  1222: "heavySnow",
  1225: "heavySnow",
  1237: "hail",
  1240: "rain",
  1243: "heavyRain",
  1246: "heavyRain",
  1249: "sleet",
  1252: "sleet",
  1255: "snow",
  1258: "heavySnow",
  1261: "hail",
  1264: "hail",
  1273: "scatteredThunderstorms",
  1276: "thunderstorms",
  1279: "scatteredThunderstorms",
  1282: "strongStorms",
};

// ─────────────────────────────────────────────────────────────────────────────

const SNOWING_CONDITIONS = new Set([
  "blowingSnow",
  "blizzard",
  "flurries",
  "heavySnow",
  "snow",
  "sleet",
  "wintryMix",
]);

const CLOUDY_CONDITIONS = new Set([
  "blowingDust",
  "blowingSnow",
  "blizzard",
  "cloudy",
  "drizzle",
  "foggy",
  "flurries",
  "freezingRain",
  "freezingDrizzle",
  "hail",
  "haze",
  "heavyRain",
  "heavySnow",
  "hurricane",
  "isolatedThunderstorms",
  "mostlyCloudy",
  "rain",
  "scatteredThunderstorms",
  "sleet",
  "snow",
  "smoky",
  "strongStorms",
  "thunderstorms",
  "tropicalStorm",
  "windy",
  "wintryMix",
]);

const TWILIGHT_SUPPORTED_CONDITIONS = new Set([
  "breezy",
  "clear",
  "frigid",
  "hot",
  "mostlyClear",
  "partlyCloudy",
  "sunFlurries",
  "sunShowers",
]);

// ─────────────────────────────────────────────────────────────────────────────

const BACKGROUND_CONFIG = {
  clearDay: ["#2D9AFF", "#6BDCFF"],
  clearNight: ["#370C6F", "#575CD4"],
  sunrise: ["#AE88FF", "#FFC1AD"],
  sunset: ["#6C77DA", "#FFC896"],
  cloudy: ["#7790A6", "#AAAAAA"],
};

// ─────────────────────────────────────────────────────────────────────────────

const SF_SYMBOL_MAPPING = {
  blowingDust: "wind",
  clear: "sun.max.fill",
  cloudy: "cloud.fill",
  foggy: "cloud.fog.fill",
  haze: "sun.haze.fill",
  mostlyClear: "sun.max.fill",
  mostlyCloudy: "cloud.fill",
  partlyCloudy: "cloud.sun.fill",
  smoky: "smoke.fill",
  breezy: "wind",
  windy: "wind",
  drizzle: "cloud.drizzle.fill",
  heavyRain: "cloud.heavyrain.fill",
  isolatedThunderstorms: "cloud.bolt.fill",
  rain: "cloud.rain.fill",
  sunShowers: "cloud.sun.rain.fill",
  scatteredThunderstorms: "cloud.bolt.fill",
  strongStorms: "cloud.bolt.rain.fill",
  thunderstorms: "cloud.bolt.fill",
  frigid: "thermometer.snowflake",
  hail: "cloud.hail.fill",
  hot: "sun.max.fill",
  flurries: "cloud.snow.fill",
  sleet: "cloud.sleet.fill",
  snow: "cloud.snow.fill",
  sunFlurries: "sun.snow.fill",
  wintryMix: "cloud.sleet.fill",
  blizzard: "wind.snow",
  blowingSnow: "wind.snow",
  freezingDrizzle: "cloud.drizzle.fill",
  freezingRain: "cloud.rain.fill",
  heavySnow: "cloud.snow.fill",
  hurricane: "hurricane",
  tropicalStorm: "tropicalstorm",

  clearNight: "moon.stars.fill",
  mostlyClearNight: "moon.stars.fill",
  hotNight: "moon.stars.fill",
  partlyCloudyNight: "cloud.moon.fill",

  sunrise: "sunrise.fill",
  sunset: "sunset.fill",
};

// ─────────────────────────────────────────────────────────────────────────────

const TWILIGHT_WINDOW_MS = 30 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────────────────

function resolveGradientKey(wkCondition, isDaylight, twilight) {
  if (!isDaylight) return "clearNight";
  if (CLOUDY_CONDITIONS.has(wkCondition)) return "cloudy";

  if (twilight && TWILIGHT_SUPPORTED_CONDITIONS.has(wkCondition)) {
    const now = Date.now();

    if (Math.abs(now - twilight.sunrise.getTime()) <= TWILIGHT_WINDOW_MS) {
      return "sunrise";
    }

    if (Math.abs(now - twilight.sunset.getTime()) <= TWILIGHT_WINDOW_MS) {
      return "sunset";
    }
  }

  return "clearDay";
}

// ─────────────────────────────────────────────────────────────────────────────

function isSnowingCondition(wkCondition) {
  return SNOWING_CONDITIONS.has(wkCondition);
}

// ─────────────────────────────────────────────────────────────────────────────

function resolveSFSymbolKey(wkCondition, isDaylight) {
  if (!isDaylight) {
    if (wkCondition === "clear" || wkCondition === "mostlyClear")
      return "clearNight";
    if (wkCondition === "hot") return "hotNight";
    if (wkCondition === "partlyCloudy") return "partlyCloudyNight";
  }
  return wkCondition;
}

// ─────────────────────────────────────────────────────────────────────────────

function resolveIconColor() {
  return "#FFFFFF";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export function transformWeatherToOverlay(apiResponse, twilight) {
  const { current } = apiResponse;
  const isDaylight = current.is_day === 1;

  const wkCondition = CODE_TO_WK_CONDITION[current.condition.code] || "cloudy";

  const gradientKey = resolveGradientKey(wkCondition, isDaylight, twilight);

  const backgroundColors = BACKGROUND_CONFIG[gradientKey];

  const sfSymbolKey = resolveSFSymbolKey(wkCondition, isDaylight);
  const sfSymbol = SF_SYMBOL_MAPPING[sfSymbolKey] || "cloud.fill";

  const iconColor = resolveIconColor();

  const tempText = `${Math.round(current.temp_c)}°C`;

  return {
    background: {
      colors: backgroundColors,
    },
    icon: {
      color: iconColor,
      data: sfSymbol,
      type: "sf_symbol",
    },
    max_lines: 1,
    payload: {
      cloud_cover: current.cloud / 100,
      is_daylight: isDaylight,
      temperature: current.temp_c,
      wk_condition: wkCondition,
    },
    text: tempText,
    text_color: "#FFFFFFE6",
    type: "weather",
  };
}