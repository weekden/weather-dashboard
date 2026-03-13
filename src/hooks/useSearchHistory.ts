import { useState } from 'react';

const STORAGE_KEY = 'weather-search-history';
const MAX_HISTORY_ITEMS = 10;

export interface UseSearchHistoryReturn {
  history: string[];
  addCity: (city: string) => void;
  clearHistory: () => void;
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) return [];
      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is string => typeof item === 'string');
    } catch {
      return [];
    }
  });

  function addCity(city: string): void {
    setHistory((prev) => {
      const deduplicated = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...deduplicated].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage may be unavailable (private browsing, quota exceeded)
      }
      return updated;
    });
  }

  function clearHistory(): void {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return { history, addCity, clearHistory };
}
