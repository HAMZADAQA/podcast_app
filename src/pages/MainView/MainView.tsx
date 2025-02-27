import React, { useState } from 'react';
import { usePodcastContext } from '@/context/PodcastContext';
import useFilteredPodcasts from '@/hooks/useFilteredPodcasts';
import SearchBar from '@/components/SearchInput/SearchInput';
import PodcastList from '@/components/PodcastList/PodcastList';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './MainView.module.css';

const MainView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { podcasts, podcastsLoading, podcastsError } = usePodcastContext();
  const filteredPodcasts = useFilteredPodcasts(podcasts, searchTerm);

  if (podcastsError) return <ErrorMessage message={podcastsError} />;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <span className={styles.count}>{filteredPodcasts.length}</span>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {filteredPodcasts.length > 0 || searchTerm === '' ? (
        <PodcastList podcasts={filteredPodcasts} loading={podcastsLoading} />
      ) : (
        <div className={styles.noResults}>
          <img
            src='/noResults.png'
            alt='No results found'
            className={styles.noResultsImage}
          />
          <p className={styles.noResultsText}>
            No podcasts found for (<strong>{searchTerm}</strong>)
          </p>
        </div>
      )}
    </div>
  );
};

export default MainView;
