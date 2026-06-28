import React from 'react';

interface SearchHistorySidebarProps {
  history: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
}

export function SearchHistorySidebar({
  history,
  onSelect,
  onClear,
}: SearchHistorySidebarProps): React.JSX.Element {
  return (
    <aside className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wide">
          Recent Searches
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-white/50 hover:text-white/80 text-xs transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-4">No recent searches</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {history.map((city) => (
            <li key={city}>
              <button
                onClick={() => onSelect(city)}
                className="w-full text-left rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm transition-colors"
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
