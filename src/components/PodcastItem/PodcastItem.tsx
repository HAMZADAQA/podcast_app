import React from 'react';
import { Link } from 'react-router-dom';
import { Podcast } from '@/types/PodcastTypes';
import PodcastImage from '../PodcastImage/PodcastImage';
import styles from './PodcastItem.module.css';
import { usePodcastContext } from '@/context/PodcastContext';

interface PodcastItemProps {
  podcast: Podcast;
}

const PodcastItem: React.FC<PodcastItemProps> = React.memo(({ podcast }) => {
  const { podcastDetails, fetchPodcastDetail } = usePodcastContext();

  const prefetchPodcastDetail = () => {
    if (!podcastDetails[podcast.id]) {
      fetchPodcastDetail(podcast.id, true);
    }
  };

  return (
    <li className={styles.podcastItem}>
      <div className={styles.imageWrapper}>
        <PodcastImage src={podcast.artwork} alt={podcast.name} />
      </div>
      <div className={styles.details}>
        <h3 className={styles.podcastTitle}>
          <Link
            to={`/podcast/${podcast.id}`}
            className={styles.podcastLink}
            onMouseEnter={prefetchPodcastDetail}
            onFocus={prefetchPodcastDetail}
          >
            {podcast.name}
          </Link>
        </h3>
        <p className={styles.podcastAuthor}>Author: {podcast.artist}</p>
      </div>
    </li>
  );
});

export default PodcastItem;
