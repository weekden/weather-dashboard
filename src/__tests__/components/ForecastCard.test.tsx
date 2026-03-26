import { render, screen } from '@testing-library/react';

import { ForecastCard } from '../../components/ForecastCard';
import { mockForecastDay } from '../__mocks__/weatherData';

describe('ForecastCard', () => {
  beforeEach(() => {
    render(<ForecastCard day={mockForecastDay} />);
  });

  it('displays the date', () => {
    expect(screen.getByText('Tue 26 Mar')).toBeDefined();
  });

  it('renders weather icon with correct src', () => {
    const img = screen.getByAltText('weather icon') as HTMLImageElement;
    expect(img.src).toBe('https://openweathermap.org/img/wn/01d@2x.png');
  });

  it('displays high temperature', () => {
    expect(screen.getByText('20°')).toBeDefined();
  });

  it('displays low temperature', () => {
    expect(screen.getByText('/ 12°')).toBeDefined();
  });

  it('displays humidity percentage', () => {
    expect(screen.getByText('73%')).toBeDefined();
  });
});
