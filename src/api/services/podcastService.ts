import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';
import { getCache } from '../utils/cacheUtil';
import { formatDuration } from '../utils/formatUtils';
import { apiClient } from '../client/apiClient';

export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const data = await apiClient<any>(
    '/us/rss/toppodcasts/limit=100/genre=1310/json'
  );
  const items = data.feed?.entry || [];
  return items.map((item: any) => ({
    id: item.id.attributes['im:id'],
    name: item['im:name'].label,
    artist: item['im:artist'].label,
    artwork: item['im:image'][2].label,
    summary: item.summary?.label || 'No summary available',
  }));
};

export const fetchPodcastDetail = async (
  podcastId: string
): Promise<{ podcast: DetailedPodcast; episodes: Episode[] }> => {
  const data = await apiClient<any>(
    `/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`
  );

  const results = data.results;
  if (!results || results.length === 0) throw new Error('Podcast not found');

  const podcastData = results[0];
  let summary = podcastData.summary || '';
  if (!summary) {
    const podcastsCache = getCache('podcastsList');
    if (podcastsCache && podcastsCache.data) {
      const found = podcastsCache.data.find((p: Podcast) => p.id === podcastId);
      summary = found ? found.summary : 'No summary available';
    } else {
      summary = 'No summary available';
    }
  }

  const podcast: DetailedPodcast = {
    id: podcastId,
    artworkUrl600: podcastData.artworkUrl600 || '',
    collectionName: podcastData.collectionName || 'Unknown Collection',
    artistName: podcastData.artistName || 'Unknown Artist',
    description: podcastData.description || 'No description available',
    summary: summary,
    episodes: [],
  };

  const episodes: Episode[] = results.slice(1).map((ep: any) => ({
    trackId: ep.trackId ?? 0,
    trackName: ep.trackName ?? 'Unknown Title',
    releaseDate: new Date(ep.releaseDate).toLocaleDateString(),
    trackTimeMillis: ep.trackTimeMillis
      ? formatDuration(ep.trackTimeMillis)
      : 'Unknown',
    episodeUrl: ep.episodeUrl || '',
    description: ep.description || 'No description available.',
  }));

  return { podcast, episodes };
};
