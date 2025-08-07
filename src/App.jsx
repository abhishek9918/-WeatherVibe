import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import ForecastCard from "./ForecastCard";
// import LocationApp from "./LocationApp";
import {
  getCurrentLocation,
  getLocationName,
} from "./services/locationService";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [currentWeatherData, setCurrentWheatherData] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function fetchWeather(city) {
    const ApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`;
    axios
      .get(ApiUrl)
      .then((response) => {
        setCurrentWheatherData(response.data);
      })
      .catch(() => {});
  }
  const fetchForecastData = (city) => {
    const ApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes&alerts=yes`;
    axios
      .get(ApiUrl)
      .then((response) => {
        const { forecast } = response?.data;

        setForecastData(forecast.forecastday);
      })
      .catch(() => {});
  };
  const fetchSuggestions = async (input) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${input}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch city suggestions", err);
    }
  };

  useEffect(() => {
    getCurrentLocation()
      .then(async (pos) => {
        const name = await getLocationName(pos.lat, pos.lng);
        if (name) {
          fetchWeather(name);
          fetchForecastData(name);
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) fetchSuggestions(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);
  const handleCitySelect = (cityName) => {
    setQuery(cityName);
    setSuggestions([]);
    fetchWeather(cityName);
    fetchForecastData(cityName);
  };
  return (
    <>
      {/* <LocationApp /> */}
      <div className="w-full max-w-4xl mx-auto card-bg rounded-3xl shadow-xl p-6 md:p-8 animate-zoomIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 animate-zoomIn">
            WeatherVibe
          </h1>
          <p className="text-gray-300 mt-2 text-base md:text-lg">
            Your sleek weather companion
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                fetchSuggestions(val);
              }}
              type="text"
              placeholder="Search for a city..."
              className="w-full p-4 pr-12 rounded-2xl bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 animate-zoomIn"
              style={{ animationDelay: "0.1s" }}
            />
            <button
              onClick={() => {
                if (query.trim()) {
                  handleCitySelect(query);
                }
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition duration-300 animate-neonPulse">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            {suggestions.length > 0 && (
              <ul className="absolute w-full bg-gray-900/80 backdrop-blur-md text-white mt-2 rounded-xl shadow-xl border border-gray-700 max-h-60 overflow-y-auto z-50 transition-opacity duration-300 opacity-100 animate-fadeIn">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
                    onClick={() => handleCitySelect(item.name)}>
                    {item.name}, {item.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div
            id="currentDetails"
            className="card-bg rounded-2xl p-6 text-gray-100 animate-zoomIn hover-lift"
            style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold mb-4 text-blue-300">New Delhi</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl md:text-6xl font-extrabold text-cyan-300">
                  {currentWeatherData?.current?.temp_c}
                  °C
                </p>
                <p className="text-gray-300 text-base md:text-lg">
                  Mostly Cloudy
                </p>
              </div>
              <div className="animate-bounce">
                <svg
                  className="w-16 h-16 text-amber-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div> */}
          <div
            id="currentDetails"
            className="card-bg rounded-2xl p-6 text-gray-100 animate-zoomIn hover-lift"
            style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold mb-4 text-blue-300">
              {currentWeatherData?.location?.name}
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl md:text-6xl font-extrabold text-cyan-300">
                  {currentWeatherData?.current?.temp_c}°C
                </p>

                <p className="text-gray-300 text-base md:text-lg">
                  {currentWeatherData?.current?.condition?.text}
                </p>
              </div>

              <div className="animate-bounce">
                <img
                  src={`https:${currentWeatherData?.current?.condition?.icon}`}
                  alt={currentWeatherData?.current?.condition?.text}
                  className="w-16 h-16"
                />
              </div>
            </div>
          </div>

          <div
            id="details"
            className="card-bg rounded-2xl p-6 text-gray-100 animate-zoomIn hover-lift"
            style={{ animationDelay: "0.3s" }}>
            <h3 className="text-xl font-bold mb-4 text-blue-300">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 text-sm md:text-base">Humidity</p>
                <p className="text-lg font-semibold text-cyan-400">
                  {currentWeatherData?.current?.humidity}%
                </p>
              </div>

              <div>
                <p className="text-gray-300 text-sm md:text-base">Wind</p>
                <p className="text-lg font-semibold text-cyan-400">
                  {currentWeatherData?.current?.wind_kph} km/h
                </p>
              </div>

              <div>
                <p className="text-gray-300 text-sm md:text-base">Pressure</p>
                <p className="text-lg font-semibold text-cyan-400">
                  {currentWeatherData?.current?.pressure_mb} hPa
                </p>
              </div>

              <div>
                <p className="text-gray-300 text-sm md:text-base">Feels Like</p>
                <p className="text-lg font-semibold text-cyan-400">
                  {currentWeatherData?.current?.feelslike_c}°C
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8" id="forecast">
          <h3 className="text-xl font-bold text-blue-300 mb-4">
            {forecastData.length}-Day Forecast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecastData.length > 0 &&
              forecastData.map((item, i) =>
                item ? <ForecastCard key={i} item={item} i={i} /> : null
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
