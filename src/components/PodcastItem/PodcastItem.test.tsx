import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PodcastItem from './PodcastItem';
import { MemoryRouter } from 'react-router-dom';
import {
  mockCachedPodcastData,
  mockCachedPodcastDetails,
} from '@/api/services/__mocks__/podcastMocks';
import { DetailedPodcast } from '@/types/PodcastTypes';
import { PodcastContext } from '@/context/PodcastContext';

describe('PodcastItem', () => {
  const podcast = mockCachedPodcastData[0];

  it('renders podcast item with image, name, and author', () => {
    render(
      <PodcastContext.Provider
        value={{
          podcasts: [],
          podcastsLoading: false,
          podcastsError: null,
          podcastDetails: {} as { [podcastId: string]: DetailedPodcast },
          fetchPodcastDetail: async () => {},
        }}
      >
        <MemoryRouter>
          <PodcastItem podcast={podcast} />
        </MemoryRouter>
      </PodcastContext.Provider>
    );

    expect(screen.getByAltText(podcast.name)).toHaveAttribute(
      'src',
      podcast.artwork
    );
    expect(screen.getByText(podcast.name)).toBeInTheDocument();
    expect(screen.getByText(`Author: ${podcast.artist}`)).toBeInTheDocument();
  });

  it('calls fetchPodcastDetail on mouse enter when detail is not cached', () => {
    const fetchPodcastDetail = jest.fn();
    render(
      <PodcastContext.Provider
        value={{
          podcasts: [],
          podcastsLoading: false,
          podcastsError: null,
          podcastDetails: {} as { [podcastId: string]: DetailedPodcast },
          fetchPodcastDetail,
        }}
      >
        <MemoryRouter>
          <PodcastItem podcast={podcast} />
        </MemoryRouter>
      </PodcastContext.Provider>
    );

    const link = screen.getByRole('link', { name: podcast.name });
    fireEvent.mouseEnter(link);
    expect(fetchPodcastDetail).toHaveBeenCalledWith(podcast.id, true);
  });

  it('does not call fetchPodcastDetail on mouse enter when detail is already cached', () => {
    const fetchPodcastDetail = jest.fn();
    render(
      <PodcastContext.Provider
        value={{
          podcasts: [],
          podcastsLoading: false,
          podcastsError: null,
          podcastDetails: { [podcast.id]: mockCachedPodcastDetails },
          fetchPodcastDetail,
        }}
      >
        <MemoryRouter>
          <PodcastItem podcast={podcast} />
        </MemoryRouter>
      </PodcastContext.Provider>
    );

    const link = screen.getByRole('link', { name: podcast.name });
    fireEvent.mouseEnter(link);
    expect(fetchPodcastDetail).not.toHaveBeenCalled();
  });
});
