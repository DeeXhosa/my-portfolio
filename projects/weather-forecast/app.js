const { useState, useEffect, useCallback, useRef } = React;

// ---------- HELPERS ----------
async function fetchCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('City not found');
  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, city: name, country };
}

async function fetchWeather(lat, lon) {
  // Request current + hourly + daily with extra fields
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.current_weather) throw new Error('Weather data unavailable');
  return data;
}

function getWeatherInfo(code) {
  const map = {
    0: { emoji: '☀️', desc: 'Clear sky' },
    1: { emoji: '🌤️', desc: 'Mainly clear' },
    2: { emoji: '⛅', desc: 'Partly cloudy' },
    3: { emoji: '☁️', desc: 'Overcast' },
    45: { emoji: '🌫️', desc: 'Fog' },
    48: { emoji: '🌫️', desc: 'Rime fog' },
    51: { emoji: '🌦️', desc: 'Light drizzle' },
    53: { emoji: '🌧️', desc: 'Moderate drizzle' },
    55: { emoji: '🌧️', desc: 'Dense drizzle' },
    61: { emoji: '🌧️', desc: 'Slight rain' },
    63: { emoji: '🌧️', desc: 'Moderate rain' },
    65: { emoji: '🌧️', desc: 'Heavy rain' },
    71: { emoji: '🌨️', desc: 'Slight snow' },
    73: { emoji: '🌨️', desc: 'Moderate snow' },
    75: { emoji: '❄️', desc: 'Heavy snow' },
    80: { emoji: '🌧️', desc: 'Rain showers' },
    81: { emoji: '🌧️', desc: 'Moderate showers' },
    82: { emoji: '🌧️', desc: 'Violent showers' },
    95: { emoji: '⛈️', desc: 'Thunderstorm' },
    96: { emoji: '⛈️', desc: 'Thunderstorm with hail' },
    99: { emoji: '⛈️', desc: 'Heavy thunderstorm' },
  };
  return map[code] || { emoji: '🌈', desc: 'Unknown' };
}

function getBackgroundClass(weatherCode) {
  // Map weather code to background style
  if ([0, 1].includes(weatherCode)) return 'sunny';
  if ([2, 3].includes(weatherCode)) return 'cloudy';
  if ([45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) return 'rainy';
  if ([71, 73, 75].includes(weatherCode)) return 'snowy';
  return 'default-bg';
}

// ---------- MAIN APP ----------
const App = () => {
  const [city, setCity] = useState('London');
  const [inputValue, setInputValue] = useState('London');
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [locationName, setLocationName] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bgClass, setBgClass] = useState('default-bg');

  const fetchData = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lon, city, country } = await fetchCoordinates(cityName);
      const data = await fetchWeather(lat, lon);
      setLocationName(`${city}, ${country}`);
      setWeather(data.current_weather);
      // Process hourly (next 24 hours)
      const hourlyData = data.hourly;
      const now = new Date();
      const currentHour = now.getHours();
      const hours = hourlyData.time.map((t, idx) => ({
        time: new Date(t),
        temp: hourlyData.temperature_2m[idx],
        humidity: hourlyData.relativehumidity_2m[idx],
        feelsLike: hourlyData.apparent_temperature[idx],
        precipProb: hourlyData.precipitation_probability[idx],
        weathercode: hourlyData.weathercode[idx],
      }));
      // Filter next 24 hours from current hour
      const next24 = hours.filter((h, i) => {
        const hh = new Date(h.time).getHours();
        // if same day, filter from current hour, else include all
        // simpler: take 24 entries starting from current hour index
        return i >= currentHour && i < currentHour + 24;
      });
      // If less than 24, wrap around? We'll just take up to 24.
      const sliced = hours.slice(currentHour, currentHour + 24);
      setHourly(sliced);

      // Process daily
      const dailyData = data.daily;
      const days = dailyData.time.map((date, idx) => ({
        date: new Date(date),
        weathercode: dailyData.weathercode[idx],
        max: dailyData.temperature_2m_max[idx],
        min: dailyData.temperature_2m_min[idx],
        feelsLikeMax: dailyData.apparent_temperature_max[idx],
        feelsLikeMin: dailyData.apparent_temperature_min[idx],
        uvIndex: dailyData.uv_index_max[idx],
        precipProb: dailyData.precipitation_probability_max[idx],
        sunrise: dailyData.sunrise ? new Date(dailyData.sunrise[idx]) : null,
        sunset: dailyData.sunset ? new Date(dailyData.sunset[idx]) : null,
      }));
      setDaily(days);

      // Set background class based on current weather
      const code = data.current_weather.weathercode;
      setBgClass(getBackgroundClass(code));
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setWeather(null);
      setHourly(null);
      setDaily(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(city);
  }, []);

  // Update body class for dynamic background
  useEffect(() => {
    document.body.className = bgClass;
  }, [bgClass]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCity(inputValue.trim());
      fetchData(inputValue.trim());
    }
  };

  const currentInfo = weather ? getWeatherInfo(weather.weathercode) : null;
  const currentTemp = weather ? Math.round(weather.temperature) : null;
  const currentWind = weather ? Math.round(weather.windspeed) : null;

  // For current details, we need extra data from hourly? Use the first hourly entry that matches current time? We'll compute from the first hourly entry with same hour.
  const getCurrentExtra = () => {
    if (!hourly || hourly.length === 0) return null;
    const now = new Date();
    const currentHour = now.getHours();
    // find first hourly with same hour (today)
    const item = hourly.find(h => new Date(h.time).getHours() === currentHour);
    if (item) {
      return {
        humidity: item.humidity,
        feelsLike: item.feelsLike,
        precipProb: item.precipProb,
      };
    }
    return null;
  };
  const extra = getCurrentExtra();

  // Get today's sunrise/sunset from daily[0]
  const today = daily && daily.length > 0 ? daily[0] : null;
  const sunrise = today && today.sunrise ? today.sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--';
  const sunset = today && today.sunset ? today.sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--';

  return (
    <div className="app-container">
      <form className="search-wrapper" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city… e.g. Tokyo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">
          <i className="fas fa-search" /> Search
        </button>
      </form>

      {error && <div className="error"><i className="fas fa-exclamation-circle" /> {error}</div>}

      {loading && (
        <div className="loading">
          <i className="fas fa-spinner" /> Loading weather…
        </div>
      )}

      {!loading && weather && (
        <>
          {/* Current Weather */}
          <div className="current-weather">
            <div className="current-left">
              <div className="weather-icon-big">{currentInfo ? currentInfo.emoji : '🌈'}</div>
              <div>
                <div className="temp-big">
                  {currentTemp}<sup>°C</sup>
                </div>
                <div className="city-name">{locationName}</div>
                <div className="condition-text">{currentInfo ? currentInfo.desc : ''}</div>
              </div>
            </div>
            <div className="current-right">
              <div className="detail-item">
                <div className="label">Feels like</div>
                <div className="value">{extra && extra.feelsLike !== undefined ? Math.round(extra.feelsLike) : '--'}°C</div>
              </div>
              <div className="detail-item">
                <div className="label">Humidity</div>
                <div className="value">{extra ? extra.humidity : '--'}%</div>
              </div>
              <div className="detail-item">
                <div className="label">Wind</div>
                <div className="value">{currentWind} km/h</div>
              </div>
              <div className="detail-item">
                <div className="label">UV Index</div>
                <div className="value">{today ? today.uvIndex.toFixed(1) : '--'}</div>
              </div>
              <div className="detail-item">
                <div className="label">Precip.</div>
                <div className="value">{today ? today.precipProb : '--'}%</div>
              </div>
              <div className="detail-item">
                <div className="label">Sunrise / Sunset</div>
                <div className="value" style={{ fontSize: '0.9rem' }}>{sunrise} / {sunset}</div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast */}
          {hourly && hourly.length > 0 && (
            <div className="hourly-section">
              <div className="section-title"><i className="fas fa-clock" /> Hourly Forecast</div>
              <div className="hourly-scroll">
                {hourly.slice(0, 12).map((h, idx) => {
                  const info = getWeatherInfo(h.weathercode);
                  const time = new Date(h.time);
                  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div className="hourly-card" key={idx}>
                      <div className="hourly-time">{timeStr}</div>
                      <div className="hourly-icon">{info.emoji}</div>
                      <div className="hourly-temp">{Math.round(h.temp)}°</div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{h.precipProb}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7‑Day Forecast */}
          {daily && (
            <>
              <div className="section-title"><i className="fas fa-calendar-alt" /> 7‑Day Forecast</div>
              <div className="forecast-grid">
                {daily.map((day, idx) => {
                  const info = getWeatherInfo(day.weathercode);
                  const dayName = idx === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <div className="forecast-card" key={idx}>
                      <div className="forecast-day">{dayName}</div>
                      <div className="forecast-icon">{info.emoji}</div>
                      <div className="forecast-temps">
                        <span className="max">{Math.round(day.max)}°</span>
                        <span className="min">{Math.round(day.min)}°</span>
                      </div>
                      <div className="forecast-precip">☔ {day.precipProb}%</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {!loading && !weather && !error && (
        <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
          <i className="fas fa-cloud-sun" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }} />
          Enter a city to see the weather
        </div>
      )}
    </div>
  );
};

// ---------- RENDER ----------
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
