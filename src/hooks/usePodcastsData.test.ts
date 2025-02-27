import { renderHook, act } from '@testing-library/react';
import { usePodcastsData } from './usePodcastsData';
import {
  fetchPodcasts,
  fetchPodcastDetail,
} from '@/api/services/podcastService';
import { getCache, setCache, isCacheValid } from '@/api/utils/cacheUtil';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/api/services/podcastService');
jest.mock('@/api/utils/cacheUtil');

// Define a custom waitFor function
const waitFor = (
  callback: () => boolean,
  timeout = 4500,
  interval = 50
): Promise<void> => {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      try {
        if (callback()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timed out waiting for condition'));
        } else {
          setTimeout(check, interval);
        }
      } catch (error) {
        reject(error);
      }
    };
    check();
  });
};

describe('usePodcastsData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads podcasts from cache if valid', async () => {
    (getCache as jest.Mock).mockReturnValue({
      data: mockCachedPodcastData,
      timestamp: Date.now(),
    });
    (isCacheValid as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => usePodcastsData());
    await waitFor(() => result.current.loading === false);
    expect(result.current.podcasts).toEqual(mockCachedPodcastData);
  });

  it('fetches podcasts if cache is invalid', async () => {
    (getCache as jest.Mock).mockReturnValue(null);
    (isCacheValid as jest.Mock).mockReturnValue(false);
    (fetchPodcasts as jest.Mock).mockResolvedValue(mockCachedPodcastData);

    const { result } = renderHook(() => usePodcastsData());
    expect(result.current.loading).toBe(true);
    await waitFor(() => result.current.loading === false);
    expect(result.current.podcasts).toEqual(mockCachedPodcastData);
    expect(fetchPodcasts).toHaveBeenCalled();
  });

  it('handles fetchPodcastDetail correctly', async () => {
    (fetchPodcastDetail as jest.Mock).mockResolvedValue({
      podcast: {
        id: '123',
        artworkUrl600: '',
        collectionName: '',
        artistName: '',
        summary: '',
        description: '',
      },
      episodes: [],
    });

    const { result } = renderHook(() => usePodcastsData());
    await act(async () => {
      await result.current.loadPodcastDetail('123', false);
    });
    expect(fetchPodcastDetail).toHaveBeenCalledWith('123');
    expect(result.current.podcastDetails['123']).toEqual({
      id: '123',
      artworkUrl600: '',
      collectionName: '',
      artistName: '',
      summary: '',
      description: '',
      episodes: [],
    });
  });

  it('sets error when fetching podcasts fails', async () => {
    (getCache as jest.Mock).mockReturnValue(null);
    (isCacheValid as jest.Mock).mockReturnValue(false);
    (fetchPodcasts as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePodcastsData());
    await waitFor(() => result.current.loading === false);
    expect(result.current.error).toBe('Error fetching podcasts');
  });
});
