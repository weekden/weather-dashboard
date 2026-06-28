import { degreesToWindDirection } from '../helpers/degreesToWindDirection';
import { groupForecastByDay } from '../helpers/groupForecastByDay';
import type {
  ForecastApiResponse,
  ForecastDay,
  WeatherApiResponse,
  WeatherData,
} from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function apiFetch<T>(
  url: string,
  errorMessage: string,
  notFoundMessage?: string
): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    if (notFoundMessage !== undefined && response.status === 404) {
      throw new Error(notFoundMessage);
    }
    throw new Error(errorMessage);
  }
  return (await response.json()) as T;
}

function mapResponseToWeatherData(data: WeatherApiResponse): WeatherData {
  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    description: data.weather[0]?.description ?? '',
    icon: data.weather[0]?.icon ?? '',
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed * 10) / 10,
    windDerection: degreesToWindDirection(data.wind.deg),
  };
}

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const data = await apiFetch<WeatherApiResponse>(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    'Failed to fetch weather data',
    `City "${city}" not found`
  );
  return mapResponseToWeatherData(data);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const data = await apiFetch<WeatherApiResponse>(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    'Failed to fetch weather data'
  );
  return mapResponseToWeatherData(data);
}

export async function fetchForecast(city: string): Promise<ForecastDay[]> {
  const data = await apiFetch<ForecastApiResponse>(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    'Failed to fetch forecast data',
    `City "${city}" not found`
  );

  return groupForecastByDay(data.list);
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastDay[]> {
  const data = await apiFetch<ForecastApiResponse>(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    'Failed to fetch forecast data'
  );
  return groupForecastByDay(data.list);
}
