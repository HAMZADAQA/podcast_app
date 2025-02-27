import React from 'react';
import styles from './PodcastItemSkeleton.module.css';

const PodcastItemSkeleton: React.FC = () => {
  return (
    <li className={styles.podcastItem}>
      <div className={styles.imageWrapper}></div>
      <div className={styles.details}>
        <div className={styles.podcastTitle}></div>
        <div className={styles.podcastAuthor}></div>
      </div>
    </li>
  );
};

export default PodcastItemSkeleton;
