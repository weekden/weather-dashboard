import type { WeatherData } from '../../types/weather';

type FetchCurrentWeather = (city: string) => Promise<WeatherData>;
type FetchWeatherByCoords = (lat: number, lon: number) => Promise<WeatherData>;

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

describe('weatherApi', () => {
  let fetchCurrentWeather: FetchCurrentWeather;
  let fetchWeatherByCoords: FetchWeatherByCoords;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-api-key');
    const mod = await import('../../api/weatherApi');
    fetchCurrentWeather = mod.fetchCurrentWeather;
    fetchWeatherByCoords = mod.fetchWeatherByCoords;
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
});
