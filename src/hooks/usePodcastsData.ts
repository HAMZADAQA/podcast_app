import { useCallback, useEffect, useState } from 'react';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
import {
  fetchPodcasts,
  fetchPodcastDetail,
} from '@/api/services/podcastService';
import { getCache, setCache, isCacheValid } from '@/api/utils/cacheUtil';

const PODCASTS_CACHE_KEY = 'podcastsList';
const PODCASTS_CACHE_EXPIRY = 86400000;
const PODCAST_DETAIL_CACHE_EXPIRY = 86400000;

export const usePodcastsData = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastDetails, setPodcastDetails] = useState<{
    [id: string]: DetailedPodcast;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPodcasts = useCallback(async () => {
    setLoading(true);
    try {
      const cached = getCache(PODCASTS_CACHE_KEY);
      if (cached && isCacheValid(cached.timestamp, PODCASTS_CACHE_EXPIRY)) {
        setPodcasts(cached.data);
      } else {
        const data = await fetchPodcasts();
        setPodcasts(data);
        setCache(PODCASTS_CACHE_KEY, data);
      }
    } catch (err) {
      setError('Error fetching podcasts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPodcastDetail = useCallback(
    async (podcastId: string, prefetch = false) => {
      // Only set global loading if not prefetching.
      if (!prefetch) setLoading(true);
      try {
        const cacheKey = `podcastDetail_${podcastId}`;
        const cached = getCache(cacheKey);
        if (
          cached &&
          isCacheValid(cached.timestamp, PODCAST_DETAIL_CACHE_EXPIRY)
        ) {
          setPodcastDetails((prev) => ({ ...prev, [podcastId]: cached.data }));
          return;
        }
        const { podcast, episodes } = await fetchPodcastDetail(podcastId);
        const detailData = { ...podcast, episodes };
        setPodcastDetails((prev) => ({ ...prev, [podcastId]: detailData }));
        setCache(cacheKey, detailData);
      } catch (err) {
        console.error(err);
      } finally {
        if (!prefetch) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadPodcasts();
  }, [loadPodcasts]);

  return { podcasts, podcastDetails, loading, error, loadPodcastDetail };
};
