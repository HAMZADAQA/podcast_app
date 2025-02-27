import React, { useEffect, useState } from 'react';
import { Podcast } from '@/types/PodcastTypes';
import PodcastItem from '../PodcastItem/PodcastItem';
import styles from './PodcastList.module.css';
import useLazyLoad from '@/hooks/useLazyLoad';
import PodcastItemSkeleton from '@/components/Skeleton/PodcastItemSkeleton/PodcastItemSkeleton';

interface PodcastListProps {
  podcasts: Podcast[];
  loading: boolean;
}

const PodcastList: React.FC<PodcastListProps> = ({ podcasts, loading }) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const { ref, inView } = useLazyLoad({ rootMargin: '100px' });

  useEffect(() => {
    if (!loading && inView && visibleCount < podcasts.length) {
      setVisibleCount((prev) => Math.min(prev + 20, podcasts.length));
    }
  }, [inView, loading, podcasts.length, visibleCount]);

  return (
    <div className={styles.podcastListWrapper}>
      <ul className={styles.podcastList}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <PodcastItemSkeleton key={i} />
            ))
          : podcasts
              .slice(0, visibleCount)
              .map((podcast) => (
                <PodcastItem key={podcast.id} podcast={podcast} />
              ))}
      </ul>
      {!loading && visibleCount < podcasts.length && (
        <div ref={ref} style={{ height: '20px' }} />
      )}
    </div>
  );
};

export default React.memo(PodcastList);
