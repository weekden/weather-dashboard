import { degreesToWindDirection } from '../helpers/degreesToWindDirection';
import type { WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherApiResponse {
  name: string;
  main: { temp: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number; deg: number };
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
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error('Failed to fetch weather data');
  }

  const data = (await response.json()) as WeatherApiResponse;
  return mapResponseToWeatherData(data);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = (await response.json()) as WeatherApiResponse;
  return mapResponseToWeatherData(data);
}
