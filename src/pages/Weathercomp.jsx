import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Weathercomp.css';
import search_icon from '../assets/search.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';
import CityCard from '../components/CityCard';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUnit } from '../store/temperature';

const App = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const unit = useSelector(state => state.temperature.unit);

  const [weatherData, setWeatherData] = useState(false);
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [forecast, setForecast] = useState([]);

  const fetchForecast = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const dailyForecast = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 5)
        .map(item => ({
          date: item.dt_txt.split(" ")[0],
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }));

      return dailyForecast;
    } catch (error) {
      console.error("Błąd pobierania prognozy:", error);
      return [];
    }
  };

  const getWindDirection = (deg) => {
    if (deg === undefined || deg === null) return "";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const search = async (city) => {
    if (!city) return alert("Enter City Name");

    inputRef.current.value = city;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) return alert(data.message);

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDir: getWindDirection(data.wind.deg),
        temperature: Math.round(data.main.temp),
        location: data.name,
        icon: data.weather[0].icon,
        rain: data.rain?.["1h"] ?? null,
        snow: data.snow?.["1h"] ?? null,
        clouds: data.clouds?.all ?? null
      });

      setForecast(await fetchForecast(city));
    } catch {
      setWeatherData(false);
      setForecast([]);
    }
  };

  const handleCityClick = useCallback(
    (city) => search(city),
    [unit]
  );


  useEffect(() => {
    const defaultCities = ["Warsaw", "Kair", "New York", "Berlin", "Prague"];

    const fetchCitiesWeather = async () => {
      const results = await Promise.all(
        defaultCities.map(async (city) => {
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`
            );
            const data = await res.json();
            if (!res.ok) return null;
            return {
              location: data.name,
              temperature: Math.round(data.main.temp),
            };
          } catch {
            return null;
          }
        })
      );
      setCitiesWeather(results.filter(Boolean));
    };

    fetchCitiesWeather();
  }, [unit]);


  useEffect(() => {
    if (weatherData?.location) {
      search(weatherData.location);
    }
  }, [unit]);

  return (
    <div className="weather">
      <div className="searchbar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />


        <button className="unit-toggle" onClick={() => dispatch(toggleUnit())}>
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      </div>

      <div className="cities-preview">
        {citiesWeather.map(city => (
          <CityCard
            key={city.location}
            location={city.location}
            temperature={`${city.temperature}°${unit === 'metric' ? 'C' : 'F'}`}
            onClick={() => handleCityClick(city.location)}
          />
        ))}
      </div>

      {weatherData && (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt=""
            className="main-weather-icon"
          />
          <p className="temperature">
            {weatherData.temperature}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/h | mph</p>
                <p>Direction: {weatherData.windDir}</p>
              </div>
            </div>

            {(weatherData.rain !== null || weatherData.snow !== null || weatherData.clouds !== undefined) &&
              (<div className="col precipitation">
                {weatherData.rain !== null && <p>RAIN: {weatherData.rain} mm</p>}
                {weatherData.snow !== null && <p>SNOW: {weatherData.snow} mm</p>}
                {weatherData.clouds !== undefined && <p>CLOUDS: {weatherData.clouds}%</p>} </div>)}

          </div>
        </>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          {forecast.map(day => (
            <div key={day.date} className="forecast-day">
              <p>{day.date}</p>
              <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} />
              <p>{day.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p>{day.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
