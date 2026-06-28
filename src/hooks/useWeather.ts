import { useCallback, useEffect, useState } from 'react';

import {
  fetchCurrentWeather,
  fetchForecast,
  fetchForecastByCoords,
  fetchWeatherByCoords,
} from '../api/weatherApi';
import { getCurrentPosition } from '../helpers/getCurrentPosition';
import type { ForecastDay, WeatherData } from '../types/weather';

const FALLBACK_CITY = 'London';

export interface WeatherState {
  weather: WeatherData;
  forecast: ForecastDay[];
}

export type LoadState = 'init' | 'searching' | 'idle';

async function fetchByCity(city: string): Promise<[WeatherData, ForecastDay[]]> {
  return Promise.all([fetchCurrentWeather(city), fetchForecast(city)]);
}

async function fetchByCoords(lat: number, lon: number): Promise<[WeatherData, ForecastDay[]]> {
  return Promise.all([fetchWeatherByCoords(lat, lon), fetchForecastByCoords(lat, lon)]);
}

export interface UseWeatherReturn {
  isCurrentLocation: boolean;
  weatherState: WeatherState | null;
  loadState: LoadState;
  error: string | null;
  handleSearch: (city: string) => Promise<void>;
}

export function useWeather(onSearchSuccess?: (cityName: string) => void): UseWeatherReturn {
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  const [weatherState, setWeatherState] = useState<WeatherState | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('init');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather(): Promise<void> {
      try {
        const coords = await getCurrentPosition();
        const [weather, forecast] = await fetchByCoords(coords.latitude, coords.longitude);
        setWeatherState({ weather, forecast });
        setIsCurrentLocation(true);
      } catch {
        try {
          const [weather, forecast] = await fetchByCity(FALLBACK_CITY);
          setWeatherState({ weather, forecast });
        } catch {
          setError('Unable to load weather data. Please try again later.');
        }
      } finally {
        setLoadState('idle');
      }
    }

    loadWeather();
  }, []);

  const handleSearch = useCallback(
    async (city: string): Promise<void> => {
      setLoadState('searching');
      setError(null);
      try {
        const [weather, forecast] = await fetchByCity(city);
        setWeatherState({ weather, forecast });
        setIsCurrentLocation(false);
        onSearchSuccess?.(weather.city);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load weather data.');
      } finally {
        setLoadState('idle');
      }
    },
    [onSearchSuccess]
  );

  return { isCurrentLocation, weatherState, loadState, error, handleSearch };
}
