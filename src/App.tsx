import './App.css';

import React, { useCallback, useState } from 'react';

import { CurrentWeather } from './components/CurrentWeather';
import { ErrorMessage } from './components/ErrorMessage';
import { ForecastSection } from './components/ForecastSection';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SearchHistorySidebar } from './components/SearchHistorySidebar';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useWeather } from './hooks/useWeather';

function App(): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { history, addCity, clearHistory } = useSearchHistory();

  const { isCurrentLocation, weatherState, loadState, error, handleSearch } = useWeather(
    useCallback(
      (cityName: string): void => {
        addCity(cityName);
        setIsSidebarOpen(false);
      },
      [addCity]
    )
  );

  const toggleSidebar = useCallback((): void => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback((): void => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col md:justify-center px-4 py-10 md:px-8">
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

      {/* Mobile overlay drawer */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 " onClick={closeSidebar}>
          <div
            className="absolute top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-600 to-indigo-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchHistorySidebar
              history={history}
              onSelect={handleSearch}
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
              onSelect={handleSearch}
              onClear={clearHistory}
            />
          </div>
        </div>

        {/* Main dashboard panel */}
        <div className="flex-1 flex flex-col items-center gap-4 w-full">
          <SearchBar onSearch={handleSearch} isLoading={loadState === 'searching'} />

          {loadState === 'init' && (
            <p className="text-white/80 text-sm">Detecting your location...</p>
          )}
          {loadState === 'searching' && (
            <p className="text-white/80 text-sm">Loading weather data...</p>
          )}
          {loadState === 'idle' && error !== null && <ErrorMessage message={error} />}
          {loadState !== 'init' && weatherState !== null && (
            <CurrentWeather data={weatherState.weather} isCurrentLocation={isCurrentLocation} />
          )}
          {loadState !== 'init' && weatherState !== null && (
            <ForecastSection forecast={weatherState.forecast} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
