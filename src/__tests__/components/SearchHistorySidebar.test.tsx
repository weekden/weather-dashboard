import { fireEvent, render, screen } from '@testing-library/react';

import { SearchHistorySidebar } from '../../components/SearchHistorySidebar';

describe('SearchHistorySidebar', () => {
  it('renders the "Recent Searches" heading', () => {
    render(<SearchHistorySidebar history={[]} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /recent searches/i })).toBeDefined();
  });

  it('renders the empty state message when history is empty', () => {
    render(<SearchHistorySidebar history={[]} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText(/no recent searches/i)).toBeDefined();
  });

  it('does not render "Clear all" button when history is empty', () => {
    render(<SearchHistorySidebar history={[]} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.queryByText(/clear all/i)).toBeNull();
  });

  it('renders a button for each city in history', () => {
    const history = ['London', 'Paris', 'Tokyo'];
    render(<SearchHistorySidebar history={history} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText('London')).toBeDefined();
    expect(screen.getByText('Paris')).toBeDefined();
    expect(screen.getByText('Tokyo')).toBeDefined();
  });

  it('calls onSelect with the city name when a city button is clicked', () => {
    const onSelect = vi.fn();
    render(<SearchHistorySidebar history={['Berlin']} onSelect={onSelect} onClear={vi.fn()} />);
    fireEvent.click(screen.getByText('Berlin'));
    expect(onSelect).toHaveBeenCalledWith('Berlin');
  });

  it('renders "Clear all" button when history is non-empty', () => {
    render(<SearchHistorySidebar history={['Rome']} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText(/clear all/i)).toBeDefined();
  });

  it('calls onClear when "Clear all" is clicked', () => {
    const onClear = vi.fn();
    render(<SearchHistorySidebar history={['Rome']} onSelect={vi.fn()} onClear={onClear} />);
    fireEvent.click(screen.getByText(/clear all/i));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
