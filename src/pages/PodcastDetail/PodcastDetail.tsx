import React from 'react';
import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './PodcastDetail.module.css';
import PodcastCard from '@/components/PodcastCard/PodcastCard';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';

const PodcastDetail: React.FC = () => {
  const { podcastId, podcastDetail } = usePodcastDetail();

  if (!podcastId) return <ErrorMessage message='No podcast selected.' />;
  if (!podcastDetail) return null;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={podcastDetail.artworkUrl600}
          title={podcastDetail.collectionName || 'Unknown Title'}
          author={podcastDetail.artistName || 'Unknown Author'}
          description={podcastDetail.summary || 'No summary available'}
        />
      </aside>
      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>
          Episodes: {podcastDetail.episodes.length}
        </h2>
        <EpisodeTable episodes={podcastDetail.episodes} podcastId={podcastId} />
      </main>
    </div>
  );
};

export default PodcastDetail;
