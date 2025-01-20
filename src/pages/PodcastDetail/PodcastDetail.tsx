import React, { useEffect, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastContext } from '@/context/PodcastContext';
import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
const PodcastCard = lazy(() => import('@/components/PodcastCard/PodcastCard'));
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './PodcastDetail.module.css';

const PodcastDetail: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetail, fetchPodcastDetail, error } = usePodcastContext();

  useEffect(() => {
    if (podcastId) {
      fetchPodcastDetail(podcastId);
    }
  }, [podcastId, fetchPodcastDetail]);

  const isDataValid = podcastDetail?.id === podcastId;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!isDataValid) {
    return null;
  }

  const episodes = podcastDetail?.episodes || [];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={podcastDetail?.artworkUrl600 || ''}
          title={podcastDetail?.collectionName || 'Unknown Title'}
          author={podcastDetail?.artistName || 'Unknown Author'}
          description={podcastDetail?.summary || 'No summary available'}
        />
      </aside>
      <main className={styles.content}>
        <div className={styles.episodesTitleWrapper}>
          <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>
        </div>
        <div className={styles.episodeTableWrapper}>
          <EpisodeTable episodes={episodes} podcastId={podcastId!} />
        </div>
      </main>
    </div>
  );
};

export default PodcastDetail;
