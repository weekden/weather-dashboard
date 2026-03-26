export interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
  windDerection: string;
}

export interface ForecastDay {
  date: string;
  icon: string;
  tempHigh: number;
  tempLow: number;
  humidity: number;
}
