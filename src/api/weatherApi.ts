import { degreesToWindDirection } from '../helpers/degreesToWindDirection';
import type { ForecastDay, WeatherData } from '../types/weather';

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

interface ForecastListItem {
  dt_txt: string;
  main: { temp_max: number; temp_min: number; humidity: number };
  weather: Array<{ icon: string }>;
}

interface ForecastApiResponse {
  list: ForecastListItem[];
}

function groupForecastByDay(list: ForecastListItem[]): ForecastDay[] {
  const dayMap = new Map<string, ForecastListItem[]>();

  for (const item of list) {
    const day = item.dt_txt.slice(0, 10);
    const existing = dayMap.get(day);
    if (existing !== undefined) {
      existing.push(item);
    } else {
      dayMap.set(day, [item]);
    }
  }

  const result: ForecastDay[] = [];

  for (const [, items] of dayMap) {
    const first = items[0];
    if (first === undefined) continue;

    const noon = items.find((i) => i.dt_txt.endsWith('12:00:00'));
    const iconItem = noon ?? first;

    const tempHigh = Math.round(Math.max(...items.map((i) => i.main.temp_max)));
    const tempLow = Math.round(Math.min(...items.map((i) => i.main.temp_min)));
    const humidity = Math.round(items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length);

    result.push({
      date: new Date(first.dt_txt).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      icon: iconItem.weather[0]?.icon ?? '',
      tempHigh,
      tempLow,
      humidity,
    });

    if (result.length === 5) break;
  }

  return result;
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
