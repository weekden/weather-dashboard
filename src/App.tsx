import './App.css';

import React, { useEffect, useState } from 'react';

import { fetchCurrentWeather, fetchWeatherByCoords } from './api/weatherApi';
import { CurrentWeather } from './components/CurrentWeather';
import { ErrorMessage } from './components/ErrorMessage';
import { getCurrentPosition } from './helpers/getCurrentPosition';
import type { WeatherData } from './types/weather';

const FALLBACK_CITY = 'London';

function App(): React.JSX.Element {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather(): Promise<void> {
      try {
        const coords = await getCurrentPosition();
        const data = await fetchWeatherByCoords(coords.latitude, coords.longitude);
        setWeather(data);
      } catch {
        try {
          const data = await fetchCurrentWeather(FALLBACK_CITY);
          setWeather(data);
        } catch {
          setError('Unable to load weather data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center p-4">
      {isLoading && <p className="text-white/80 text-sm">Detecting your location...</p>}
      {!isLoading && error !== null && <ErrorMessage message={error} />}
      {!isLoading && weather !== null && <CurrentWeather data={weather} />}
    </div>
  );
}

export default App;
