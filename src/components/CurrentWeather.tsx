import React from 'react';

import type { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps): React.JSX.Element {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl p-6 text-white">
      {/* City name */}
      <h2 className="text-lg font-medium text-white/80 mb-4">{data.city}</h2>

      {/* Temperature + icon */}
      <div className="flex items-center gap-2 mb-1">
        <img src={iconUrl} alt={data.description} className="w-16 h-16 -ml-2" />
        <span className="text-6xl font-bold">{data.temp}°C</span>
      </div>

      {/* Description */}
      <p className="text-white/70 capitalize text-sm mb-6">{data.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 p-3 text-center">
          <p className="text-white/60 text-xs mb-1">Humidity</p>
          <p className="text-xl font-semibold">{data.humidity}%</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3 text-center">
          <p className="text-white/60 text-xs mb-1">Wind </p>
          <p className="text-xl font-semibold">{data.windDerection}</p>
          <p className="text-xl font-semibold">{data.wind} m/s</p>
        </div>
      </div>
    </div>
  );
}
