import {
  fetchPodcasts,
  fetchPodcastDetails,
} from '@/api/services/podcastService';
import { apiClient } from '@/api/client/apiClient';
import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
import {
  mockCachedPodcastData,
  mockApiPodcastsResponse,
  mockCachedPodcastDetails,
  mockApiPodcastDetailsResponse,
} from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/api/client/apiClient');
jest.mock('@/api/utils/cacheUtil');

describe('podcastService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPodcasts', () => {
    it('fetches and transforms podcast data successfully when cache is empty', async () => {
      (getCachedData as jest.Mock).mockReturnValue(null);
      (apiClient as jest.Mock).mockResolvedValue(mockApiPodcastsResponse);

      const result = await fetchPodcasts();

      expect(apiClient).toHaveBeenCalledWith(
        '/us/rss/toppodcasts/limit=100/genre=1310/json'
      );
      expect(result).toEqual(mockCachedPodcastData);
      expect(setCachedData).toHaveBeenCalledWith(
        'podcasts',
        mockCachedPodcastData
      );
    });

    it('returns cached podcasts if available', async () => {
      (getCachedData as jest.Mock).mockReturnValue(mockCachedPodcastData);

      const result = await fetchPodcasts();

      expect(result).toEqual(mockCachedPodcastData);
      expect(apiClient).not.toHaveBeenCalled();
    });

    it('handles API errors gracefully', async () => {
      (getCachedData as jest.Mock).mockReturnValue(null);
      (apiClient as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(fetchPodcasts()).rejects.toThrow('API Error');
    });
  });

  describe('fetchPodcastDetails', () => {
    it('fetches and transforms podcast details successfully when cache is empty', async () => {
      (getCachedData as jest.Mock).mockReturnValue(null);
      (apiClient as jest.Mock)
        .mockResolvedValueOnce(mockApiPodcastsResponse)
        .mockResolvedValueOnce(mockApiPodcastDetailsResponse);

      const result = await fetchPodcastDetails('1535809341');

      expect(apiClient).toHaveBeenCalledWith(
        '/us/rss/toppodcasts/limit=100/genre=1310/json'
      );
      expect(apiClient).toHaveBeenCalledWith(
        '/lookup?id=1535809341&entity=podcastEpisode'
      );
      expect(result).toEqual(mockCachedPodcastDetails);
      expect(setCachedData).toHaveBeenCalledWith(`podcast-1535809341`, result);
    });

    it('returns cached podcast details if available', async () => {
      (getCachedData as jest.Mock).mockReturnValue(mockCachedPodcastDetails);

      const result = await fetchPodcastDetails('1535809341');

      expect(result).toEqual(mockCachedPodcastDetails);
      expect(apiClient).not.toHaveBeenCalled();
    });

    it('handles API errors gracefully', async () => {
      (getCachedData as jest.Mock).mockReturnValue(null);
      (apiClient as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(fetchPodcastDetails('1535809341')).rejects.toThrow(
        'API Error'
      );
    });

    it('handles invalid podcast data format gracefully', async () => {
      (getCachedData as jest.Mock).mockReturnValue(null);
      (apiClient as jest.Mock)
        .mockResolvedValueOnce({ feed: { entry: [] } }) // Invalid podcast list
        .mockResolvedValueOnce({ results: [] }); // Invalid podcast details

      await expect(fetchPodcastDetails('1535809341')).rejects.toThrow(
        'Invalid podcast details or data format'
      );
    });
  });
});
