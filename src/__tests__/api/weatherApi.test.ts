import type { ForecastDay, WeatherData } from '../../types/weather';

type FetchCurrentWeather = (city: string) => Promise<WeatherData>;
type FetchWeatherByCoords = (lat: number, lon: number) => Promise<WeatherData>;
type FetchForecast = (city: string) => Promise<ForecastDay[]>;
type FetchForecastByCoords = (lat: number, lon: number) => Promise<ForecastDay[]>;

function makeFetchMock(status: number, body: unknown): ReturnType<typeof vi.fn> {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response);
}

const mockApiResponse = {
  name: 'London',
  main: { temp: 15.3, humidity: 82 },
  weather: [{ description: 'light rain', icon: '10d' }],
  wind: { speed: 5.4, deg: 225 },
};

// Two days: 2024-03-26 has a noon slot; 2024-03-27 has no noon slot
const mockForecastApiResponse = {
  list: [
    {
      dt_txt: '2024-03-26 09:00:00',
      main: { temp_max: 18, temp_min: 12, humidity: 75 },
      weather: [{ icon: '02d' }],
    },
    {
      dt_txt: '2024-03-26 12:00:00',
      main: { temp_max: 20, temp_min: 13, humidity: 70 },
      weather: [{ icon: '01d' }],
    },
    {
      dt_txt: '2024-03-27 09:00:00',
      main: { temp_max: 15, temp_min: 9, humidity: 80 },
      weather: [{ icon: '10d' }],
    },
  ],
};

describe('weatherApi', () => {
  let fetchCurrentWeather: FetchCurrentWeather;
  let fetchWeatherByCoords: FetchWeatherByCoords;
  let fetchForecast: FetchForecast;
  let fetchForecastByCoords: FetchForecastByCoords;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-api-key');
    const mod = await import('../../api/weatherApi');
    fetchCurrentWeather = mod.fetchCurrentWeather;
    fetchWeatherByCoords = mod.fetchWeatherByCoords;
    fetchForecast = mod.fetchForecast;
    fetchForecastByCoords = mod.fetchForecastByCoords;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe('fetchCurrentWeather', () => {
    it('calls fetch with correct URL params', async () => {
      const mockFetch = makeFetchMock(200, mockApiResponse);
      vi.stubGlobal('fetch', mockFetch);

      await fetchCurrentWeather('London');

      const url = mockFetch.mock.calls[0]?.[0] as string;
      expect(url).toContain('q=London');
      expect(url).toContain('appid=test-api-key');
      expect(url).toContain('units=metric');
    });

    it('maps API response to WeatherData with temp rounding and windDerection', async () => {
      vi.stubGlobal('fetch', makeFetchMock(200, mockApiResponse));

      const result = await fetchCurrentWeather('London');

      expect(result).toEqual<WeatherData>({
        city: 'London',
        temp: 15,
        description: 'light rain',
        icon: '10d',
        humidity: 82,
        wind: 5.4,
        windDerection: 'SW ↙',
      });
    });

    it('throws "City not found" on 404', async () => {
      vi.stubGlobal('fetch', makeFetchMock(404, {}));

      await expect(fetchCurrentWeather('Atlantis')).rejects.toThrow('City "Atlantis" not found');
    });

    it('throws "Failed to fetch" on 500', async () => {
      vi.stubGlobal('fetch', makeFetchMock(500, {}));

      await expect(fetchCurrentWeather('London')).rejects.toThrow('Failed to fetch weather data');
    });
  });

  describe('fetchWeatherByCoords', () => {
    it('calls fetch with correct URL params', async () => {
      const mockFetch = makeFetchMock(200, mockApiResponse);
      vi.stubGlobal('fetch', mockFetch);

      await fetchWeatherByCoords(51.5, -0.1);

      const url = mockFetch.mock.calls[0]?.[0] as string;
      expect(url).toContain('lat=51.5');
      expect(url).toContain('lon=-0.1');
      expect(url).toContain('appid=test-api-key');
    });

    it('maps API response to WeatherData', async () => {
      vi.stubGlobal('fetch', makeFetchMock(200, mockApiResponse));

      const result = await fetchWeatherByCoords(51.5, -0.1);

      expect(result.city).toBe('London');
      expect(result.temp).toBe(15);
      expect(result.windDerection).toBe('SW ↙');
    });

    it('throws "Failed to fetch" on non-2xx response', async () => {
      vi.stubGlobal('fetch', makeFetchMock(503, {}));

      await expect(fetchWeatherByCoords(51.5, -0.1)).rejects.toThrow(
        'Failed to fetch weather data'
      );
    });
  });

  describe('fetchForecast', () => {
    it('calls fetch with correct URL params', async () => {
      const mockFetch = makeFetchMock(200, mockForecastApiResponse);
      vi.stubGlobal('fetch', mockFetch);

      await fetchForecast('London');

      const url = mockFetch.mock.calls[0]?.[0] as string;
      expect(url).toContain('forecast');
      expect(url).toContain('q=London');
      expect(url).toContain('appid=test-api-key');
      expect(url).toContain('units=metric');
    });

    it('returns grouped ForecastDay array with correct values', async () => {
      vi.stubGlobal('fetch', makeFetchMock(200, mockForecastApiResponse));

      const result = await fetchForecast('London');

      expect(result).toHaveLength(2);
      // Day 1: noon icon used, tempHigh = max(18,20)=20, tempLow = min(12,13)=12, humidity = round((75+70)/2)=73
      expect(result[0]).toMatchObject<Omit<ForecastDay, 'date'>>({
        icon: '01d',
        tempHigh: 20,
        tempLow: 12,
        humidity: 73,
      });
      // Day 2: no noon, uses first item icon
      expect(result[1]).toMatchObject<Omit<ForecastDay, 'date'>>({
        icon: '10d',
        tempHigh: 15,
        tempLow: 9,
        humidity: 80,
      });
    });

    it('throws "City not found" on 404', async () => {
      vi.stubGlobal('fetch', makeFetchMock(404, {}));

      await expect(fetchForecast('Atlantis')).rejects.toThrow('City "Atlantis" not found');
    });

    it('throws "Failed to fetch forecast data" on 500', async () => {
      vi.stubGlobal('fetch', makeFetchMock(500, {}));

      await expect(fetchForecast('London')).rejects.toThrow('Failed to fetch forecast data');
    });
  });

  describe('fetchForecastByCoords', () => {
    it('calls fetch with correct URL params', async () => {
      const mockFetch = makeFetchMock(200, mockForecastApiResponse);
      vi.stubGlobal('fetch', mockFetch);

      await fetchForecastByCoords(51.5, -0.1);

      const url = mockFetch.mock.calls[0]?.[0] as string;
      expect(url).toContain('forecast');
      expect(url).toContain('lat=51.5');
      expect(url).toContain('lon=-0.1');
      expect(url).toContain('appid=test-api-key');
    });

    it('returns grouped ForecastDay array', async () => {
      vi.stubGlobal('fetch', makeFetchMock(200, mockForecastApiResponse));

      const result = await fetchForecastByCoords(51.5, -0.1);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject<Omit<ForecastDay, 'date'>>({
        icon: '01d',
        tempHigh: 20,
        tempLow: 12,
        humidity: 73,
      });
    });

    it('throws "Failed to fetch forecast data" on non-2xx response', async () => {
      vi.stubGlobal('fetch', makeFetchMock(503, {}));

      await expect(fetchForecastByCoords(51.5, -0.1)).rejects.toThrow(
        'Failed to fetch forecast data'
      );
    });
  });
});
