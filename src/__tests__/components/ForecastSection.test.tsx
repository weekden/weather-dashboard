import { render, screen } from '@testing-library/react';

import { ForecastSection } from '../../components/ForecastSection';
import type { ForecastDay } from '../../types/weather';

const mockForecast: ForecastDay[] = [
  { date: 'Mon 24 Mar', icon: '01d', tempHigh: 18, tempLow: 10, humidity: 65 },
  { date: 'Tue 25 Mar', icon: '02d', tempHigh: 15, tempLow: 8, humidity: 70 },
  { date: 'Wed 26 Mar', icon: '10d', tempHigh: 12, tempLow: 6, humidity: 80 },
  { date: 'Thu 27 Mar', icon: '03d', tempHigh: 14, tempLow: 7, humidity: 75 },
  { date: 'Fri 28 Mar', icon: '04d', tempHigh: 16, tempLow: 9, humidity: 68 },
];

describe('ForecastSection', () => {
  it('renders the section heading', () => {
    render(<ForecastSection forecast={mockForecast} />);
    expect(screen.getByText('5-Day Forecast')).toBeDefined();
  });

  it('renders one card per day in the forecast array', () => {
    render(<ForecastSection forecast={mockForecast} />);
    const icons = screen.getAllByAltText('weather icon');
    expect(icons).toHaveLength(5);
  });

  it('renders each day date', () => {
    render(<ForecastSection forecast={mockForecast} />);
    expect(screen.getByText('Mon 24 Mar')).toBeDefined();
    expect(screen.getByText('Tue 25 Mar')).toBeDefined();
    expect(screen.getByText('Fri 28 Mar')).toBeDefined();
  });

  it('renders no cards for an empty forecast array', () => {
    render(<ForecastSection forecast={[]} />);
    expect(screen.queryAllByAltText('weather icon')).toHaveLength(0);
  });
});
