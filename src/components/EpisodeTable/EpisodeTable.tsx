import React from 'react';
import { Link } from 'react-router-dom';
import { Episode } from '@/types/PodcastTypes';
import styles from './EpisodeTable.module.css';

interface EpisodeTableProps {
  episodes: Episode[];
  podcastId: string;
}

const EpisodeTable: React.FC<EpisodeTableProps> = ({ episodes, podcastId }) => {
  if (episodes.length === 0) {
    return null;
  }
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
            <td>{episode.releaseDate}</td>
            <td>{episode.trackTimeMillis}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EpisodeTable;
