import React, { useEffect, useState } from "react";
import {
  LuCloud,
  LuCloudRain,
  LuCloudSnow,
  LuCloudSun,
  LuSun,
} from "react-icons/lu";
import { useIntl } from "react-intl";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER;
const WEATHER_CITY = "Ho Chi Minh City";

function getWeatherIcon(code, isDay, size = 32) {
  const style = { fontSize: size };
  if (code === 1000) {
    return isDay ? <LuSun style={style} /> : <LuCloud style={style} />;
  }
  if (code <= 1009) return <LuCloudSun style={style} />;
  if (code <= 1030) return <LuCloud style={style} />;
  if (code <= 1201) return <LuCloudRain style={style} />;
  if (code <= 1282) return <LuCloudSnow style={style} />;
  return <LuCloudSun style={style} />;
}

function getWeatherBg(code, isDay) {
  if (!isDay) return "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)";
  if (code === 1000) {
    return "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 60%, #bae6fd 100%)";
  }
  if (code <= 1009) return "linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)";
  if (code <= 1030) return "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)";
  if (code <= 1201) return "linear-gradient(135deg, #334155 0%, #475569 100%)";
  return "linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)";
}

export default function WeatherWidget() {
  const intl = useIntl();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const weatherLang = intl.locale.startsWith("vi") ? "vi" : "en";

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(WEATHER_CITY)}&lang=${weatherLang}`,
    )
      .then((r) => r.json())
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, [weatherLang]);

  if (loading) {
    return <div className="weather-widget weather-widget--loading" />;
  }

  if (!weather) {
    return (
      <div className="weather-widget weather-widget--error">
        <LuCloudSun />
        <span>{intl.formatMessage({ id: "dashboard_weather_error" })}</span>
      </div>
    );
  }

  const { current, location } = weather;
  const code = current.condition.code;
  const isDay = current.is_day === 1;

  return (
    <div
      className="weather-widget"
      style={{ background: getWeatherBg(code, isDay) }}
    >
      <div className="weather-widget__orb weather-widget__orb--1" />
      <div className="weather-widget__orb weather-widget__orb--2" />

      <div className="weather-widget__top">
        <div>
          <div className="weather-widget__city">{location.name}</div>
          <div className="weather-widget__condition">{current.condition.text}</div>
        </div>
        <div className="weather-widget__icon-wrap">
          {getWeatherIcon(code, isDay)}
        </div>
      </div>

      <div className="weather-widget__temp">
        {Math.round(current.temp_c)}
        <span className="weather-widget__temp-unit">Â°C</span>
      </div>
    </div>
  );
}
