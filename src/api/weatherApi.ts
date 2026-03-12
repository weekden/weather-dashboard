import { degreesToWindDirection } from '../helpers/degreesToWindDirection';
import type { WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchCurrentWeather(_city: string): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(_city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${_city}" not found`);
    }
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  console.log(data);

  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed * 10) / 10,
    windDerection: degreesToWindDirection(data.wind.deg),
  };
}
