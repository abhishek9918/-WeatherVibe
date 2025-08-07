// src/services/locationService.js
import axios from "axios";

const GEOCODE_API_KEY = "83bea82c41734a11b840c295a591e9c1";

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        resolve(coords);
      },
      (err) => {
        reject("Permission denied or unable to get location.");
      },
      options
    );
  });
};

export const getLocationName = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${GEOCODE_API_KEY}`
    );
    const components = res.data.results[0].components;
    return (
      components.city ||
      components.town ||
      components.village ||
      components.state ||
      components.country ||
      "Unknown location"
    );
  } catch (err) {
    throw new Error("Failed to get location name.");
  }
};
