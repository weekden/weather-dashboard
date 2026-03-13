import { render, screen } from '@testing-library/react';

import { CurrentWeather } from '../../components/CurrentWeather';
import { mockWeatherData } from '../__mocks__/weatherData';

describe('CurrentWeather', () => {
  beforeEach(() => {
    render(<CurrentWeather data={mockWeatherData} />);
  });

  it('displays city name', () => {
    expect(screen.getByText('London')).toBeDefined();
  });

  it('displays temperature with °C suffix', () => {
    expect(screen.getByText('15°C')).toBeDefined();
  });

  it('displays weather description', () => {
    expect(screen.getByText('light rain')).toBeDefined();
  });

  it('renders weather icon with correct src and alt', () => {
    const img = screen.getByAltText('light rain') as HTMLImageElement;
    expect(img.src).toBe('https://openweathermap.org/img/wn/10d@2x.png');
  });

  it('displays humidity percentage', () => {
    expect(screen.getByText('82%')).toBeDefined();
  });

  it('displays wind speed', () => {
    expect(screen.getByText('5.4 m/s')).toBeDefined();
  });

  it('displays wind direction', () => {
    expect(screen.getByText('SW ↙')).toBeDefined();
  });
});
