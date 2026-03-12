import './App.css';

import React, { useEffect } from 'react';

import { fetchCurrentWeather } from './api/weatherApi';

function App(): React.JSX.Element {
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const weatherData = await fetchCurrentWeather('Brest');

      console.log(weatherData);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Weather Dashboard</h1>
    </div>
  );
}

export default App;
