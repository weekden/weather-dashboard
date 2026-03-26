import type { ForecastDay, WeatherData } from '../../types/weather';

export const mockWeatherData: WeatherData = {
  city: 'London',
  temp: 15,
  description: 'light rain',
  icon: '10d',
  humidity: 82,
  wind: 5.4,
  windDerection: 'SW ↙',
};

export const mockForecastDay: ForecastDay = {
  date: 'Tue 26 Mar',
  icon: '01d',
  tempHigh: 20,
  tempLow: 12,
  humidity: 73,
};
