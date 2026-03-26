import './App.css';

import React, { useEffect, useState } from 'react';

import {
  fetchCurrentWeather,
  fetchForecast,
  fetchForecastByCoords,
  fetchWeatherByCoords,
} from './api/weatherApi';
import { CurrentWeather } from './components/CurrentWeather';
import { ErrorMessage } from './components/ErrorMessage';
import { SearchBar } from './components/SearchBar';
import { SearchHistorySidebar } from './components/SearchHistorySidebar';
import { getCurrentPosition } from './helpers/getCurrentPosition';
import { useSearchHistory } from './hooks/useSearchHistory';
import type { ForecastDay, WeatherData } from './types/weather';

const FALLBACK_CITY = 'London';

function App(): React.JSX.Element {
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [, setForecast] = useState<ForecastDay[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { history, addCity, clearHistory } = useSearchHistory();

  useEffect(() => {
    async function loadWeather(): Promise<void> {
      try {
        const coords = await getCurrentPosition();
        const [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCoords(coords.latitude, coords.longitude),
          fetchForecastByCoords(coords.latitude, coords.longitude),
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
        setIsCurrentLocation(true);
      } catch {
        try {
          const [weatherData, forecastData] = await Promise.all([
            fetchCurrentWeather(FALLBACK_CITY),
            fetchForecast(FALLBACK_CITY),
          ]);
          setWeather(weatherData);
          setForecast(forecastData);
        } catch {
          setError('Unable to load weather data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadWeather();
  }, []);

  async function handleCitySearch(city: string): Promise<void> {
    setIsSearchLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      console.log('5-Day Forecast:', forecastData);
      addCity(weatherData.city);
      setIsSidebarOpen(false);
      setIsCurrentLocation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load weather data.');
    } finally {
      setIsSearchLoading(false);
    }
  }

  function toggleSidebar(): void {
    setIsSidebarOpen((prev) => !prev);
  }

  function closeSidebar(): void {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col md:justify-center px-4 py-10 md:px-8">
      {/* Mobile hamburger button */}
      <div className="md:hidden flex justify-end mb-6">
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close search history' : 'Open search history'}
          className="text-white bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-lg transition-colors"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile overlay drawer */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={closeSidebar}
        >
          <div
            className="absolute top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-600 to-indigo-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchHistorySidebar
              history={history}
              onSelect={handleCitySearch}
              onClear={clearHistory}
            />
          </div>
        </div>
      )}

      {/* Main two-column layout */}
      <div className="flex flex-col md:flex-row md:items-stretch justify-center gap-8 max-w-4xl mx-auto w-full">
        {/* Sidebar — desktop only (mobile uses overlay) */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <div className="h-full rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl p-5">
            <SearchHistorySidebar
              history={history}
              onSelect={handleCitySearch}
              onClear={clearHistory}
            />
          </div>
        </div>

        {/* Main dashboard panel */}
        <div className="flex-1 flex flex-col items-center gap-4 w-full">
          <SearchBar onSearch={handleCitySearch} isLoading={isSearchLoading} />

          {isLoading && <p className="text-white/80 text-sm">Detecting your location...</p>}
          {!isLoading && isSearchLoading && (
            <p className="text-white/80 text-sm">Loading weather data...</p>
          )}
          {!isLoading && !isSearchLoading && error !== null && <ErrorMessage message={error} />}
          {!isLoading && weather !== null && (
            <CurrentWeather data={weather} isCurrentLocation={isCurrentLocation} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
