import React from 'react';
import { useParams } from 'react-router-dom';
import PodcastCard from '@/components/PodcastCard/PodcastCard';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './PodcastEpisode.module.css';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';

const PodcastEpisode: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const { podcastId, podcastDetail } = usePodcastDetail();

  if (!podcastId) return <ErrorMessage message='No podcast selected.' />;
  if (!podcastDetail) return <p>Loading episode details...</p>;

  const episode = podcastDetail.episodes.find(
    (ep: any) => String(ep.trackId) === episodeId
  );
  if (!episode) return <ErrorMessage message='Episode not found.' />;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={podcastDetail.artworkUrl600}
          title={podcastDetail.collectionName}
          author={podcastDetail.artistName}
          description={podcastDetail.summary}
        />
      </aside>
      <main className={styles.mainContent}>
        <h2 className={styles.episodeTitle}>{episode.trackName}</h2>
        <p
          className={styles.episodeDescription}
          dangerouslySetInnerHTML={{
            __html: episode.description || 'No description available.',
          }}
        />
        <div className={styles.audioPlayerContainer}>
          <audio
            controls
            className={styles.audioPlayer}
            data-testid='audio-player'
          >
            <source
              src={episode.episodeUrl}
              type='audio/mpeg'
              data-testid='audio-source'
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      </main>
    </div>
  );
};

export default PodcastEpisode;
