import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ForecastCard from "./ForecastCard";
import {
  getCurrentLocation,
  getLocationName,
} from "./services/locationService";
import Loader from "./Loader";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [weatherType, setWeatherType] = useState("clear");

  const API_KEY = import.meta.env.VITE_API_KEY;
  const [loader, setLoader] = useState(false);
  const [currentWeatherData, setCurrentWeatherData] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  async function fetchWeather(city) {
    const ApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`;
    try {
      setLoader(true);
      const response = await axios.get(ApiUrl);
      const code = response.data.current.condition.code;
      if (code) {
        setWeatherType(checkWeatherType(code));
      }
      setCurrentWeatherData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  }
  const checkWeatherType = (code) => {
    const rainCodes = [
      1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246,
    ];
    const snowCodes = [
      1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258,
    ];
    const cloudyCodes = [1003, 1006, 1009, 1030, 1135, 1147];
    const clearCodes = [1000];

    if (rainCodes.includes(code)) return "rain";
    if (snowCodes.includes(code)) return "snow";
    if (cloudyCodes.includes(code)) return "cloudy";
    if (clearCodes.includes(code)) return "clear";
    return "clear";
  };
  const fetchForecastData = async (city) => {
    const ApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes&alerts=yes`;
    try {
      setLoader(true);
      const response = await axios.get(ApiUrl);
      setForecastData(response?.data?.forecast?.forecastday);
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
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
          fetchWeatherInfo(name, false);
        }
      })
      .catch((err) => {
        setLocationDenied(true);
      });
  }, []);
  useEffect(() => {
    if (debouncedQuery && isUserTyping) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery, isUserTyping]);
  const handleCitySelect = (cityName) => {
    fetchWeatherInfo(cityName);
  };
  const fetchWeatherInfo = (cityName, updateQuery = true) => {
    setLocationDenied(false);
    if (updateQuery) {
      setQuery(cityName);
      setIsUserTyping(false);
    }

    fetchWeather(cityName);
    fetchForecastData(cityName);
    setSuggestions([]);
  };

  return (
    <>
      <Loader loader={loader} />

      <div
        className="w-full max-w-4xl mx-auto card-bg rounded-3xl shadow-xl p-6 md:p-8 animate-zoomIn overflow-x-hidden;
">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 animate-zoomIn shimmer-text">
            WeatherVibe
          </h1>
          <p className="text-gray-300 mt-2 text-base md:text-lg">
            Your sleek weather companion
          </p>
        </div>
        {locationDenied && (
          <div className="text-yellow-400  text-sm md:text-base mb-4 bg-yellow-900/20 border border-yellow-500 p-3 xs:p-2 rounded-lg text-center">
            📍 Location permission was denied. Please search for a city
            manually.
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                setIsUserTyping(true);
                setLocationDenied(false);
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-700 hover:to-cyan-600 ">
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

        {currentWeatherData?.current ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              id="currentDetails"
              className="card-bg rounded-2xl p-6 text-gray-100 animate-zoomIn hover-lift"
              style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-bold mb-2 text-blue-300">
                {currentWeatherData?.location?.name}
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-0.5">
                {currentWeatherData?.location?.region},{" "}
                {currentWeatherData?.location?.country}
              </p>

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
                    className="w-16 h-16 weather-icon"
                  />
                </div>
              </div>
            </div>

            {/* Details Card */}
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
                  <p className="text-gray-300 text-sm md:text-base">
                    Feels Like
                  </p>
                  <p className="text-lg font-semibold text-cyan-400">
                    {currentWeatherData?.current?.feelslike_c}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-4">
            🔍 No weather data yet. Search for a city above.
          </div>
        )}

        {forecastData.length > 0 && (
          <div id="forecast">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse my-4">
              {forecastData.length}-Day Forecast
            </h2>

            <div className="flex overflow-x-auto p-4 space-x-4">
              {forecastData.map((item, i) =>
                item ? <ForecastCard key={i} item={item} i={i} /> : null
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
