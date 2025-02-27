import { usePodcastContext } from '@/context/PodcastContext';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const usePodcastDetail = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetails, fetchPodcastDetail } = usePodcastContext();

  useEffect(() => {
    if (podcastId) {
      fetchPodcastDetail(podcastId);
    }
  }, [podcastId, fetchPodcastDetail]);

  return {
    podcastId,
    podcastDetail: podcastId ? podcastDetails[podcastId] : null,
  };
};
