import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { usePodcastContext } from '@/context/PodcastContext';

jest.mock('@/context/PodcastContext', () => ({
  usePodcastContext: jest.fn(),
}));

describe('Header Component', () => {
  it('renders the title link', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({ globalLoading: false });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const titleLink = screen.getByRole('link', { name: /podcaster/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('does not render the Spinner when globalLoading is false', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({ globalLoading: false });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('spinner-overlay')).not.toBeInTheDocument();
  });

  it('renders the Spinner when globalLoading is true', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({ globalLoading: true });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const spinnerOverlay = screen.getByTestId('spinner-overlay');
    expect(spinnerOverlay).toBeInTheDocument();
  });
});
