

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Weather = () => {
//   const [weather, setWeather] = useState(null);
//   const [city, setCity] = useState("");

//   useEffect(() => {
//     // Auto-detect location using browser geolocation
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         try {
//           const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
//           const response = await axios.get(
//             `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
//           );
//           setWeather(response.data);
//           setCity(response.data.name);
//         } catch (err) {
//           console.error("Error fetching weather data:", err);
//         }
//       });
//     }
//   }, []);

//   return (
//     <div className="w-full flex justify-center px-4">
//       <div className="w-full md:w-3/4 lg:w-1/2 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center">
//         <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
//           🌤️ Live Weather Report
//         </h2>

//         {weather ? (
//           <>
//             <h3 className="text-lg md:text-xl font-semibold text-gray-800">
//               {city}, {weather.sys.country}
//             </h3>
//             <img
//               src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
//               alt="Weather Icon"
//               className="w-20 h-20 md:w-24 md:h-24"
//             />
//             <p className="text-3xl md:text-4xl font-bold text-gray-900">
//               {Math.round(weather.main.temp)}°C
//             </p>
//             <p className="text-gray-600 capitalize">
//               {weather.weather[0].description}
//             </p>

//             <div className="grid grid-cols-2 gap-4 mt-6 w-full">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Humidity</p>
//                 <p className="font-semibold">{weather.main.humidity}%</p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Wind Speed</p>
//                 <p className="font-semibold">{weather.wind.speed} m/s</p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Feels Like</p>
//                 <p className="font-semibold">
//                   {Math.round(weather.main.feels_like)}°C
//                 </p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Pressure</p>
//                 <p className="font-semibold">{weather.main.pressure} hPa</p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-500">Fetching weather data...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Weather;



import React, { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather by city
  const fetchWeatherByCity = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);

      // Fetch forecast
      fetchForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
      console.error("Weather API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);

      // Fetch forecast
      fetchForecast(lat, lon);
    } catch (err) {
      console.error("Weather API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      // Group by day (pick 12:00 noon for each day)
      const daily = data.list.filter((f) => f.dt_txt.includes("12:00:00"));
      setForecast(daily.slice(0, 5)); // Next 5 days
    } catch (err) {
      console.error("Forecast API error:", err);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          // ❌ fallback city if denied
          fetchWeatherByCity("Lagos");
        }
      );
    } else {
      fetchWeatherByCity("Lagos");
    }
  }, []);

    // Refresh weather
  const handleRefresh = () => {
    if (location?.lat && location?.lon) {
      fetchWeatherByCoords(location.lat, location.lon);
    } else if (location?.city) {
      fetchWeatherByCity(location.city);
    } else {
      fetchWeatherByCity("Lagos");
    }
  };

  if (loading) return <p className="text-center">Fetching weather data...</p>;

  if (!weather) return <p className="text-center text-red-500">Weather data unavailable</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 my-6 text-center">

       {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          🌤️ Weather Update
        </h2>
        <button
          onClick={handleRefresh}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Current Weather */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{weather.name}</h3>
          <p className="text-gray-500">{weather.weather[0].description}</p>
          <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
        </div>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
          alt="weather icon"
          className="w-28 h-28"
        />
      </div>

      {/* 5-Day Forecast */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-green-600">📅 5-Day Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {forecast.map((day) => (
            <div
              key={day.dt}
              className="bg-gray-50 p-3 rounded-lg shadow text-center"
            >
              <p className="font-semibold">
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="forecast icon"
                className="mx-auto"
              />
              <p className="font-bold">{Math.round(day.main.temp)}°C</p>
              <p className="text-sm text-gray-500">
                {day.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
