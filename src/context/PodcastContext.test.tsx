import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { PodcastProvider, usePodcastContext } from '@/context/PodcastContext';
import {
  fetchPodcasts,
  fetchPodcastDetails,
} from '@/api/services/podcastService';
import {
  mockCachedPodcastData,
  mockCachedPodcastDetails,
} from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/api/services/podcastService');

const mockFetchPodcasts = fetchPodcasts as jest.MockedFunction<
  typeof fetchPodcasts
>;
const mockFetchPodcastDetails = fetchPodcastDetails as jest.MockedFunction<
  typeof fetchPodcastDetails
>;

const TestComponent: React.FC = () => {
  const { podcasts, podcastDetail, fetchPodcastDetail, error, globalLoading } =
    usePodcastContext();

  return (
    <div>
      {globalLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul data-testid='podcast-list'>
        {podcasts?.map((podcast) => (
          <li key={podcast.id}>{podcast.name}</li>
        )) || <p>No podcasts available</p>}
      </ul>
      {podcastDetail && (
        <p data-testid='podcast-detail'>{podcastDetail.collectionName}</p>
      )}
      <button
        data-testid='fetch-detail'
        onClick={() => fetchPodcastDetail('1535809341')}
      >
        Fetch Podcast Detail
      </button>
    </div>
  );
};

describe('PodcastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and provides podcasts on initial render', async () => {
    mockFetchPodcasts.mockResolvedValueOnce(mockCachedPodcastData);

    await act(async () => {
      render(
        <PodcastProvider>
          <TestComponent />
        </PodcastProvider>
      );
    });

    const podcastList = screen.getByTestId('podcast-list');
    expect(mockFetchPodcasts).toHaveBeenCalledTimes(1);
    expect(podcastList.children.length).toBe(mockCachedPodcastData.length);
    expect(podcastList).toHaveTextContent('The Joe Budden Podcast');
  });

  it('fetches and provides podcast details on button click', async () => {
    mockFetchPodcasts.mockResolvedValueOnce(mockCachedPodcastData);
    mockFetchPodcastDetails.mockResolvedValueOnce(mockCachedPodcastDetails);

    await act(async () => {
      render(
        <PodcastProvider>
          <TestComponent />
        </PodcastProvider>
      );
    });

    const fetchDetailButton = screen.getByTestId('fetch-detail');
    await act(async () => {
      fetchDetailButton.click();
    });

    const podcastDetail = screen.getByTestId('podcast-detail');
    expect(mockFetchPodcastDetails).toHaveBeenCalledWith('1535809341');
    expect(podcastDetail).toHaveTextContent('The Joe Budden Podcast');
  });

  it('handles errors during podcast fetching', async () => {
    mockFetchPodcasts.mockRejectedValueOnce(new Error('Fetch error'));

    await act(async () => {
      render(
        <PodcastProvider>
          <TestComponent />
        </PodcastProvider>
      );
    });

    expect(screen.getByText(/Unable to fetch podcasts./i)).toBeInTheDocument();
  });

  it('handles errors during podcast detail fetching', async () => {
    mockFetchPodcasts.mockResolvedValueOnce(mockCachedPodcastData);
    mockFetchPodcastDetails.mockRejectedValueOnce(
      new Error('Fetch detail error')
    );

    await act(async () => {
      render(
        <PodcastProvider>
          <TestComponent />
        </PodcastProvider>
      );
    });

    const fetchDetailButton = screen.getByTestId('fetch-detail');
    await act(async () => {
      fetchDetailButton.click();
    });

    expect(
      screen.getByText(/Unable to fetch podcast details./i)
    ).toBeInTheDocument();
  });
});
