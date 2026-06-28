import React from 'react';

import type { ForecastDay } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
}

export function ForecastCard({ day }: ForecastCardProps): React.JSX.Element {
  const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

  return (
    <div className="flex flex-row justify-between items-center rounded-xl bg-white/10 p-3 text-white text-center gap-1 sm:flex-col">
      <p className="text-white/60 text-xs font-medium">{day.date}</p>
      <img src={iconUrl} alt="weather icon" className="w-10 h-10" />
      <div className="flex gap-1 text-sm font-semibold">
        <span>{day.tempHigh}°</span>
        <span className="text-white/50">/ {day.tempLow}°</span>
      </div>
      <p className="text-white/60 text-xs">{day.humidity}%</p>
    </div>
  );
}
