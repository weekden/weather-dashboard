import { fireEvent, render, screen } from '@testing-library/react';

import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
  it('renders the text input and submit button', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);
    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByRole('button', { name: /search/i })).toBeDefined();
  });

  it('calls onSearch with trimmed value on form submit', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={false} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Paris  ' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSearch).toHaveBeenCalledWith('Paris');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('does not call onSearch when input is empty', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={false} />);
    fireEvent.submit(screen.getByRole('form'));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('does not call onSearch when input is whitespace-only', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} isLoading={false} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('clears the input after a successful submit', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Tokyo' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(input.value).toBe('');
  });

  it('disables input and button when isLoading is true', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={true} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /search/i }) as HTMLButtonElement).disabled).toBe(
      true
    );
  });

  it('disables submit button when input is empty', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);
    expect((screen.getByRole('button', { name: /search/i }) as HTMLButtonElement).disabled).toBe(
      true
    );
  });
});
