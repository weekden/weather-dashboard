import React from 'react';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps): React.JSX.Element {
  return (
    <header className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full  md:px-0">
      <h1 className="text-white text-2xl font-bold tracking-tight">⛅ Weather Dashboard</h1>
      <button
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? 'Close search history' : 'Open search history'}
        className="md:hidden text-white bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-lg transition-colors"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>
    </header>
  );
}
