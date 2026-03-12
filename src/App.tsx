import './App.css';

import React, { useEffect, useState } from 'react';

import { fetchCurrentWeather } from './api/weatherApi';
import { CurrentWeather } from './components/CurrentWeather';
import type { WeatherData } from './types/weather';

function App(): React.JSX.Element {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const weatherData = await fetchCurrentWeather('London');
      console.log(weatherData);
      setWeather(weatherData);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center p-4">
      {weather !== null && <CurrentWeather data={weather} />}
    </div>
  );
}

export default App;
