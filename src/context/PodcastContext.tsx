import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  fetchPodcasts,
  fetchPodcastDetails,
} from '@/api/services/podcastService';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

interface PodcastContextType {
  podcasts: Podcast[];
  podcastDetail: DetailedPodcast | null;
  error: string | null;
  fetchPodcastDetail: (id: string) => Promise<void>;
  globalLoading: boolean;
}

interface PodcastProviderProps {
  children: ReactNode;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export const PodcastProvider: React.FC<PodcastProviderProps> = ({
  children,
}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastDetail, setPodcastDetail] = useState<DetailedPodcast | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const fetchAllPodcasts = async () => {
      try {
        setGlobalLoading(true);
        const data = await fetchPodcasts();
        setPodcasts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch podcasts:', err);
        setError('Unable to fetch podcasts.');
      } finally {
        setGlobalLoading(false);
      }
    };

    fetchAllPodcasts();
  }, []);

  const fetchPodcastDetail = useCallback(async (id: string) => {
    try {
      setGlobalLoading(true);
      const detail = await fetchPodcastDetails(id);
      setPodcastDetail(detail);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch podcast details:', err);
      setError('Unable to fetch podcast details.');
      setPodcastDetail(null);
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  return (
    <PodcastContext.Provider
      value={{
        podcasts,
        podcastDetail,
        error,
        fetchPodcastDetail,
        globalLoading,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = (): PodcastContextType => {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcastContext must be used within a PodcastProvider');
  }
  return context;
};
