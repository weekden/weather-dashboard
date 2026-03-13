import { getCurrentPosition } from '../../helpers/getCurrentPosition';

describe('getCurrentPosition', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });
  });

  it('resolves with coordinates on success', async () => {
    const mockCoords = { latitude: 51.5, longitude: -0.1 };

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi
          .fn()
          .mockImplementation((success: (pos: GeolocationPosition) => void) => {
            success({ coords: mockCoords } as GeolocationPosition);
          }),
      },
      configurable: true,
    });

    const coords = await getCurrentPosition();

    expect(coords.latitude).toBe(51.5);
    expect(coords.longitude).toBe(-0.1);
  });

  it('rejects with the geolocation error on failure', async () => {
    const mockError = new Error('User denied geolocation') as unknown as GeolocationPositionError;

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi
          .fn()
          .mockImplementation(
            (_success: unknown, error: (err: GeolocationPositionError) => void) => {
              error(mockError);
            }
          ),
      },
      configurable: true,
    });

    await expect(getCurrentPosition()).rejects.toBe(mockError);
  });

  it('rejects with "not supported" when geolocation is unavailable', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    await expect(getCurrentPosition()).rejects.toThrow(
      'Geolocation is not supported by this browser'
    );
  });
});
