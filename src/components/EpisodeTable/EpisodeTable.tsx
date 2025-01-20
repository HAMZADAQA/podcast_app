import React from 'react';
import { Link } from 'react-router-dom';
import { formatDuration } from '@/api/utils/formatUtils';
import { Episode } from '@/types/PodcastTypes';
import styles from './EpisodeTable.module.css';

interface EpisodeTableProps {
  episodes: Episode[];
  podcastId: string;
}

const EpisodeTable: React.FC<EpisodeTableProps> = ({ episodes, podcastId }) => {
  return (
    <table className={styles.episodesTable}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {episodes.map((episode) => (
          <tr key={episode.trackId}>
            <td>
              <Link
                to={`/podcast/${podcastId}/episode/${episode.trackId}`}
                className={styles.episodeLink}
              >
                {episode.trackName}
              </Link>
            </td>
            <td>{new Date(episode.releaseDate).toLocaleDateString()}</td>
            <td>{formatDuration(episode.trackTimeMillis)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EpisodeTable;
