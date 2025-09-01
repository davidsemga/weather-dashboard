import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [recentCities, setRecentCities] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecentCities(stored);
  }, []);

  const fetchWeather = async (searchCity) => {
    if (!searchCity) {
      alert("Please enter a city!");
      return;
    }

    const key = "process.env.REACT_APP_WEATHER_KEY"; // replace with your OpenWeather API key

    try {
      // Fetch current weather
      const res = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=imperial`
);
      const data = await res.json();

      if (data.cod !== 200) {
        alert(`Error: ${data.message}`);
        setWeather(null);
        setForecast([]);
        return;
      }
      setWeather(data);

      // Fetch forecast
      const forecastRes = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${key}&units=imperial`    
);
      const forecastData = await forecastRes.json();

      if (!forecastData.list) {
        setForecast([]);
        return;
      }

      const chartData = forecastData.list
        .filter((_, i) => i % 8 === 0)
        .map((d) => ({
          date: d.dt_txt.split(" ")[0],
          temp: d.main.temp,
        }));
      setForecast(chartData);

      // Save recent cities
      const updated = [searchCity, ...recentCities.filter((c) => c !== searchCity)].slice(0, 5);
      setRecentCities(updated);
      localStorage.setItem("recentCities", JSON.stringify(updated));
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
      setWeather(null);
      setForecast([]);
    }
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const key = "process.env.REACT_APP_WEATHER_KEY";
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&units=metric`
          );
          const data = await res.json();
          if (data.cod !== 200) {
            alert(`Error: ${data.message}`);
            return;
          }
          setWeather(data);
          setCity(data.name);
          fetchWeather(data.name); // also fetch forecast
        } catch (error) {
          console.error(error);
          alert("Unable to fetch location weather.");
        }
      },
      (err) => {
        console.error(err);
        alert("Location permission denied.");
      }
    );
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#000000ff" : "#f9f9f9",
        color: darkMode ? "white" : "#111",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div
          className="card"
          style={{
            position: "relative",
            backgroundColor: darkMode ? "#111827" : "white",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: "2rem",
            width: "350px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem 1rem" }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <h1>Weather Dashboard</h1>

          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Enter city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchWeather(city);
              }}
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", width: "70%" }}
            />
            <button
              onClick={() => fetchWeather(city)}
              style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem", border: "none", borderRadius: "8px", backgroundColor: "#3B82F6", color: "white" }}
            >
              Search
            </button>
          </div>

          <button
            onClick={getLocationWeather}
            style={{
              marginTop: "1rem",
              background: "transparent",
              color: darkMode ? "#000102ff" : "#000000ff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Use My Location
          </button>

          <div style={{ marginTop: "1rem" }}>
            {recentCities.map((c) => (
              <button
                key={c}
                onClick={() => fetchWeather(c)}
                style={{ margin: "0.25rem", background: "#ddd", color: "#111", border: "none", borderRadius: "8px", padding: "0.25rem 0.5rem" }}
              >
                {c}
              </button>
            ))}
          </div>

          {weather && weather.main && (
            <div className="weather-info" style={{ marginTop: "1.5rem" }}>
              <h2>{weather.name}</h2>
              <p style={{ textTransform: "capitalize" }}>{weather.weather[0].description}</p>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
              <p style={{ fontSize: "2rem" }}>{weather.main.temp}°F</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          )}

          {forecast.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <LineChart width={300} height={150} data={forecast}>
                <Line type="monotone" dataKey="temp" stroke="#3B82F6" strokeWidth={2} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
              </LineChart>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
