import React from 'react';
import { Link } from 'react-router-dom';
import { Podcast } from '../../types/PodcastTypes';
import PodcastImage from '../PodcastImage/PodcastImage';
import styles from './PodcastItem.module.css';

interface PodcastItemProps {
  podcast: Podcast;
}

const PodcastItem: React.FC<PodcastItemProps> = React.memo(({ podcast }) => {
  return (
    <li className={styles.podcastItem}>
      <div className={styles.imageWrapper}>
        <PodcastImage src={podcast.artwork} alt={podcast.name} />
      </div>
      <div className={styles.details}>
        <h3 className={styles.podcastTitle}>
          <Link to={`/podcast/${podcast.id}`} className={styles.podcastLink}>
            {podcast.name}
          </Link>
        </h3>
        <p className={styles.podcastAuthor}>Author: {podcast.artist}</p>
      </div>
    </li>
  );
});

export default PodcastItem;
