import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { PodcastContext } from '@/context/PodcastContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../Spinner/Spinner', () => () => <div data-testid='spinner' />);

describe('Header', () => {
  it('renders title and does not show spinner when podcastsLoading is false', () => {
    render(
      <PodcastContext.Provider
        value={{
          podcasts: [],
          podcastsLoading: false,
          podcastsError: null,
          podcastDetails: {},
          fetchPodcastDetail: async () => {},
        }}
      >
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </PodcastContext.Provider>
    );
    expect(screen.getByText('Podcaster')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).toBeNull();
  });

  it('shows spinner when podcastsLoading is true', () => {
    render(
      <PodcastContext.Provider
        value={{
          podcasts: [],
          podcastsLoading: true,
          podcastsError: null,
          podcastDetails: {},
          fetchPodcastDetail: async () => {},
        }}
      >
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </PodcastContext.Provider>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
