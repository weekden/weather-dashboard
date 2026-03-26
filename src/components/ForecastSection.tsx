import React from 'react';

import type { ForecastDay } from '../types/weather';
import { ForecastCard } from './ForecastCard';

interface ForecastSectionProps {
  forecast: ForecastDay[];
}

export function ForecastSection({ forecast }: ForecastSectionProps): React.JSX.Element {
  return (
    <div className="w-full rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl p-6 text-white">
      <h3 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
