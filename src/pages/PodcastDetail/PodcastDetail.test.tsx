import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PodcastDetail from './PodcastDetail';
import { usePodcastContext } from '@/context/PodcastContext';
import { mockCachedPodcastDetails } from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/context/PodcastContext', () => ({
  usePodcastContext: jest.fn(),
}));

jest.mock('@/components/EpisodeTable/EpisodeTable', () =>
  jest.fn(() => <div data-testid='episode-table'></div>)
);
jest.mock('@/components/PodcastCard/PodcastCard', () =>
  jest.fn(() => <div data-testid='podcast-card'></div>)
);
jest.mock('@/components/ErrorMessage/ErrorMessage', () =>
  jest.fn(({ message }) => <div data-testid='error-message'>{message}</div>)
);

describe('PodcastDetail Component', () => {
  const mockFetchPodcastDetail = jest.fn();
  const podcastId = mockCachedPodcastDetails.id;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an error message when there is an error', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: null,
      fetchPodcastDetail: mockFetchPodcastDetail,
      error: 'An error occurred',
    });

    render(
      <MemoryRouter initialEntries={[`/podcast/${podcastId}`]}>
        <Routes>
          <Route path='/podcast/:podcastId' element={<PodcastDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders nothing if data is not valid', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: { ...mockCachedPodcastDetails, id: 'different-id' },
      fetchPodcastDetail: mockFetchPodcastDetail,
      error: null,
    });

    const { container } = render(
      <MemoryRouter initialEntries={[`/podcast/${podcastId}`]}>
        <Routes>
          <Route path='/podcast/:podcastId' element={<PodcastDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders podcast details and episodes when valid data is available', async () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: mockCachedPodcastDetails,
      fetchPodcastDetail: mockFetchPodcastDetail,
      error: null,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MemoryRouter initialEntries={[`/podcast/${podcastId}`]}>
          <Routes>
            <Route path='/podcast/:podcastId' element={<PodcastDetail />} />
          </Routes>
        </MemoryRouter>
      </Suspense>
    );

    // Verify PodcastCard
    expect(await screen.findByTestId('podcast-card')).toBeInTheDocument();

    // Verify EpisodeTable
    expect(screen.getByTestId('episode-table')).toBeInTheDocument();

    // Verify episode count
    expect(screen.getByText('Episodes: 1')).toBeInTheDocument();
  });

  it('calls fetchPodcastDetail when podcastId changes', () => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcastDetail: null,
      fetchPodcastDetail: mockFetchPodcastDetail,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={[`/podcast/${podcastId}`]}>
        <Routes>
          <Route path='/podcast/:podcastId' element={<PodcastDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockFetchPodcastDetail).toHaveBeenCalledWith(podcastId);
  });
});
