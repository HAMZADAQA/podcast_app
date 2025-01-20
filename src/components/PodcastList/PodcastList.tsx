import React from 'react';
import { Podcast } from '@/types/PodcastTypes';
import PodcastItem from '../PodcastItem/PodcastItem';
import styles from './PodcastList.module.css';

interface PodcastListProps {
  podcasts: Podcast[];
}

const PodcastList: React.FC<PodcastListProps> = ({ podcasts }) => {
  if (!podcasts || podcasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.podcastListWrapper}>
      <ul className={styles.podcastList}>
        {podcasts.map((podcast) => (
          <PodcastItem key={podcast.id} podcast={podcast} />
        ))}
      </ul>
    </div>
  );
};

export default PodcastList;
