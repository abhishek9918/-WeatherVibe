// import { useState, useEffect } from "react";
// import axios from "axios";

// const GEOCODE_API_KEY = "83bea82c41734a11b840c295a591e9c1";

// export default function LocationApp() {
//   const [location, setLocation] = useState(null);
//   const [locationName, setLocationName] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const options = {
//       enableHighAccuracy: true,
//       timeout: 10000,
//       maximumAge: 0,
//     };

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         console.log("New Accurate Coords:", position.coords);
//         const coords = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setLocation(coords);
//         getLocationName(coords.lat, coords.lng);
//       },
//       (err) => {
//         console.log("Location error:", err);
//         setError("Permission denied or unable to get location.");
//       },
//       options
//     );
//   }, []);

//   const getLocationName = async (lat, lng) => {
//     try {
//       const res = await axios.get(
//         `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${GEOCODE_API_KEY}`
//       );
//       const components = res.data.results[0].components;
//       const name =
//         components.city ||
//         components.town ||
//         components.village ||
//         components.state ||
//         components.country ||
//         "Unknown location";
//       setLocationName(name);
//     } catch (err) {
//       console.log("Geocoding failed:", err);
//       setLocationName("Unable to retrieve name.");
//     }
//   };

//   return <></>;
// }
