import { act, renderHook } from '@testing-library/react';

import { useSearchHistory } from '../../hooks/useSearchHistory';

describe('useSearchHistory', () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete storage[key];
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initialises with an empty history when localStorage is empty', () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it('initialises from existing localStorage data', () => {
    storage['weather-search-history'] = JSON.stringify(['Paris', 'Tokyo']);
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual(['Paris', 'Tokyo']);
  });

  it('returns empty array when localStorage contains invalid JSON', () => {
    storage['weather-search-history'] = 'not-json{{';
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it('returns empty array when localStorage contains non-array JSON', () => {
    storage['weather-search-history'] = JSON.stringify({ city: 'London' });
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it('addCity prepends the city to the history', () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addCity('Berlin');
    });
    expect(result.current.history[0]).toBe('Berlin');
  });

  it('addCity moves an existing city to the top (case-insensitive dedup)', () => {
    storage['weather-search-history'] = JSON.stringify(['London', 'Paris']);
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addCity('london');
    });
    expect(result.current.history[0]).toBe('london');
    expect(result.current.history).toHaveLength(2);
  });

  it('addCity caps history at 10 items', () => {
    const cities = Array.from({ length: 10 }, (_, i) => `City${String(i)}`);
    storage['weather-search-history'] = JSON.stringify(cities);
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addCity('NewCity');
    });
    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0]).toBe('NewCity');
  });

  it('addCity persists to localStorage', () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.addCity('Rome');
    });
    const stored: unknown = JSON.parse(storage['weather-search-history'] ?? '[]');
    expect(stored).toEqual(['Rome']);
  });

  it('clearHistory empties the history array', () => {
    storage['weather-search-history'] = JSON.stringify(['Madrid']);
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.history).toEqual([]);
  });

  it('clearHistory removes the localStorage key', () => {
    storage['weather-search-history'] = JSON.stringify(['Madrid']);
    const { result } = renderHook(() => useSearchHistory());
    act(() => {
      result.current.clearHistory();
    });
    expect(storage['weather-search-history']).toBeUndefined();
  });
});
