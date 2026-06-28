import { render, screen } from '@testing-library/react';

import { ErrorMessage } from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the provided message string', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeDefined();
  });

  it('renders different messages correctly', () => {
    render(<ErrorMessage message='City "XYZ" not found' />);
    expect(screen.getByText('City "XYZ" not found')).toBeDefined();
  });

  it('renders without throwing when message is an empty string', () => {
    expect(() => render(<ErrorMessage message="" />)).not.toThrow();
  });
});
