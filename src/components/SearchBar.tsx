import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps): React.JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed === '') return;
    onSearch(trimmed);
    setInputValue('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="City search form" className="flex gap-2 w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search city..."
        disabled={isLoading}
        className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || inputValue.trim() === ''}
        className="rounded-xl bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Search
      </button>
    </form>
  );
}
