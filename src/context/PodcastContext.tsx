import React, { createContext, ReactNode, useContext } from 'react';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
import { usePodcastsData } from '@/hooks/usePodcastsData';

export interface PodcastContextType {
  podcasts: Podcast[];
  podcastsLoading: boolean;
  podcastsError: string | null;
  podcastDetails: { [podcastId: string]: DetailedPodcast };
  fetchPodcastDetail: (podcastId: string, prefetch?: boolean) => Promise<void>;
}

export const PodcastContext = createContext<PodcastContextType | undefined>(
  undefined
);

export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { podcasts, podcastDetails, loading, error, loadPodcastDetail } =
    usePodcastsData();

  return (
    <PodcastContext.Provider
      value={{
        podcasts,
        podcastsLoading: loading,
        podcastsError: error,
        podcastDetails,
        fetchPodcastDetail: loadPodcastDetail,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = () => {
  const context = useContext(PodcastContext);

  if (!context) {
    throw new Error('usePodcastContext must be used within a PodcastProvider');
  }

  return context;
};
