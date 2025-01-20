import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

jest.mock('./Spinner.module.css', () => ({
  spinnerOverlay: 'spinnerOverlay',
  spinner: 'spinner',
}));

describe('Spinner Component', () => {
  it('renders the spinner overlay and spinner elements', () => {
    render(<Spinner />);

    // Check for the spinner overlay
    const overlay = screen.getByTestId('spinner-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('spinnerOverlay');

    // Check for the spinner itself
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner');
  });
});
