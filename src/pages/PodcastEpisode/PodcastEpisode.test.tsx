import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PodcastEpisode from './PodcastEpisode';
import { usePodcastContext } from '@/context/PodcastContext';
import { mockCachedPodcastDetails } from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/context/PodcastContext', () => ({
  usePodcastContext: jest.fn(),
}));

jest.mock('@/components/PodcastCard/PodcastCard', () =>
  jest.fn(() => <div data-testid='podcast-card'></div>)
);

jest.mock('@/components/ErrorMessage/ErrorMessage', () =>
  jest.fn(({ message }) => <div data-testid='error-message'>{message}</div>)
);

describe('PodcastEpisode Component', () => {
  const podcastId = mockCachedPodcastDetails.id;
  const episode = mockCachedPodcastDetails.episodes[0];
  const episodeId = episode.trackId.toString();
  const mockFetchPodcastDetail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when podcast details are loading', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: null,
      fetchPodcastDetail: mockFetchPodcastDetail,
    });

    render(
      <MemoryRouter
        initialEntries={[`/podcast/${podcastId}/episode/${episodeId}`]}
      >
        <Routes>
          <Route
            path='/podcast/:podcastId/episode/:episodeId'
            element={<PodcastEpisode />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Verify that nothing is rendered initially
    expect(screen.queryByTestId('podcast-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();

    // Verify that fetchPodcastDetail is called
    expect(mockFetchPodcastDetail).toHaveBeenCalledWith(podcastId);
  });

  it('renders an error message when the podcast details are not available', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: { id: podcastId, episodes: [] }, // Correct podcastId but no episodes
      fetchPodcastDetail: mockFetchPodcastDetail,
    });

    render(
      <MemoryRouter
        initialEntries={[`/podcast/${podcastId}/episode/${episodeId}`]}
      >
        <Routes>
          <Route
            path='/podcast/:podcastId/episode/:episodeId'
            element={<PodcastEpisode />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Verify fetchPodcastDetail was called
    expect(mockFetchPodcastDetail).not.toHaveBeenCalled();

    // Assert the error message is rendered
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Episode not found.')).toBeInTheDocument();
  });

  it('renders an error message when the episode is not found', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: mockCachedPodcastDetails,
      fetchPodcastDetail: mockFetchPodcastDetail,
    });

    render(
      <MemoryRouter initialEntries={[`/podcast/${podcastId}/episode/9999`]}>
        <Routes>
          <Route
            path='/podcast/:podcastId/episode/:episodeId'
            element={<PodcastEpisode />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Assert that the error message is rendered
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Episode not found.')).toBeInTheDocument();
  });

  it('renders the podcast episode details when data is available', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: mockCachedPodcastDetails,
      fetchPodcastDetail: mockFetchPodcastDetail,
    });

    render(
      <MemoryRouter
        initialEntries={[`/podcast/${podcastId}/episode/${episodeId}`]}
      >
        <Routes>
          <Route
            path='/podcast/:podcastId/episode/:episodeId'
            element={<PodcastEpisode />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Verify that the PodcastCard is rendered
    expect(screen.getByTestId('podcast-card')).toBeInTheDocument();

    // Verify the episode title and description
    expect(screen.getByText(episode.trackName)).toBeInTheDocument();
    expect(
      screen.getByText(episode.description || 'No description available.')
    ).toBeInTheDocument();

    // Verify the audio player
    const audioElement = screen.getByTestId('audio-player');
    expect(audioElement).toBeInTheDocument();

    // Verify the audio source
    const sourceElement = screen.getByTestId('audio-source');
    expect(sourceElement).toHaveAttribute('src', episode.episodeUrl);
  });

  it('renders fallback text when the episode has no description', () => {
    const podcastDetailWithNoDescription = {
      ...mockCachedPodcastDetails,
      episodes: [
        {
          ...episode,
          description: '',
        },
      ],
    };

    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: podcastDetailWithNoDescription,
      fetchPodcastDetail: mockFetchPodcastDetail,
    });

    render(
      <MemoryRouter
        initialEntries={[`/podcast/${podcastId}/episode/${episodeId}`]}
      >
        <Routes>
          <Route
            path='/podcast/:podcastId/episode/:episodeId'
            element={<PodcastEpisode />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Verify the fallback description
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });
});
