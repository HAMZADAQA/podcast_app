import { fetchPodcasts, fetchPodcastDetail } from './podcastService';
import { apiClient } from '@/api/client/apiClient';
import { getCache } from '@/api/utils/cacheUtil';
import { formatDuration } from '@/api/utils/formatUtils';
import {
  mockApiPodcastsResponse,
  mockApiPodcastDetailsResponse,
} from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/api/client/apiClient');
jest.mock('@/api/utils/cacheUtil');
jest.mock('@/api/utils/formatUtils');

describe('podcastService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchPodcasts', () => {
    it('transforms API response into Podcast[]', async () => {
      (apiClient as jest.Mock).mockResolvedValue(mockApiPodcastsResponse);
      const podcasts = await fetchPodcasts();
      expect(podcasts).toEqual([
        {
          id: '1535809341',
          name: 'The Joe Budden Podcast',
          artist: 'The Joe Budden Network',
          artwork:
            'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
          summary: 'Tune into Joe Budden and his friends.',
        },
      ]);
    });
  });

  describe('fetchPodcastDetail', () => {
    it('throws error if results array is empty', async () => {
      (apiClient as jest.Mock).mockResolvedValue({ results: [] });
      await expect(fetchPodcastDetail('1535809341')).rejects.toThrow(
        'Podcast not found'
      );
    });

    it('transforms API response into DetailedPodcast and Episodes', async () => {
      // Make formatDuration return a predictable value.
      (formatDuration as jest.Mock).mockReturnValue('1 hr 0 min');
      (apiClient as jest.Mock).mockResolvedValue(mockApiPodcastDetailsResponse);
      // Simulate no cached detail.
      (getCache as jest.Mock).mockReturnValue(null);

      const { podcast, episodes } = await fetchPodcastDetail('1535809341');
      expect(podcast).toEqual({
        id: '1535809341',
        artworkUrl600:
          'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/600x600bb.jpg',
        collectionName: 'The Joe Budden Podcast',
        artistName: 'The Joe Budden Network',
        description: 'Tune into Joe Budden and his friends.',
        summary: 'Tune into Joe Budden and his friends.',
        episodes: [],
      });
      expect(episodes).toEqual([
        {
          trackId: 1,
          trackName: 'Episode 790',
          releaseDate: new Date('2025-01-14T20:32:00Z').toLocaleDateString(),
          trackTimeMillis: '1 hr 0 min',
          episodeUrl:
            'https://verifi.podscribe.com/rss/p/traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_790.mp3?dest-id=2422538',
          description: 'Episode 790 description.',
        },
      ]);
    });
  });
});
