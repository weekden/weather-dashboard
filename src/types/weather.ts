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

export interface WeatherApiResponse {
  name: string;
  main: { temp: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number; deg: number };
}

export interface ForecastListItem {
  dt_txt: string;
  main: { temp_max: number; temp_min: number; humidity: number };
  weather: Array<{ icon: string }>;
}

export interface ForecastApiResponse {
  list: ForecastListItem[];
}
