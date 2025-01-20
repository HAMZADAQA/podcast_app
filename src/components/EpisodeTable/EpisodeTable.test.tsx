import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EpisodeTable from './EpisodeTable';
import { mockCachedPodcastDetails } from '@/api/services/__mocks__/podcastMocks';
import { formatDuration } from '@/api/utils/formatUtils';

describe('EpisodeTable Component', () => {
  const mockPodcastId = mockCachedPodcastDetails.id;
  const mockEpisodes = mockCachedPodcastDetails.episodes;

  it('renders the table headers', () => {
    render(
      <BrowserRouter>
        <EpisodeTable episodes={[]} podcastId={mockPodcastId} />
      </BrowserRouter>
    );

    const headers = ['Title', 'Date', 'Duration'];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders the correct number of rows for episodes', () => {
    render(
      <BrowserRouter>
        <EpisodeTable episodes={mockEpisodes} podcastId={mockPodcastId} />
      </BrowserRouter>
    );

    const rows = screen.getAllByRole('row');
    // Including the header row, there should be mockEpisodes.length + 1 rows
    expect(rows).toHaveLength(mockEpisodes.length + 1);
  });

  it('renders episode details correctly', () => {
    render(
      <BrowserRouter>
        <EpisodeTable episodes={mockEpisodes} podcastId={mockPodcastId} />
      </BrowserRouter>
    );

    mockEpisodes.forEach((episode) => {
      // Check episode name with link
      const episodeLink = screen.getByRole('link', { name: episode.trackName });
      expect(episodeLink).toBeInTheDocument();
      expect(episodeLink).toHaveAttribute(
        'href',
        `/podcast/${mockPodcastId}/episode/${episode.trackId}`
      );

      // Check formatted date
      expect(
        screen.getByText(new Date(episode.releaseDate).toLocaleDateString())
      ).toBeInTheDocument();

      // Check formatted duration using the real formatDuration
      const formattedDuration = formatDuration(episode.trackTimeMillis);
      expect(screen.getByText(formattedDuration)).toBeInTheDocument();
    });
  });

  it('renders no rows when no episodes are provided', () => {
    render(
      <BrowserRouter>
        <EpisodeTable episodes={[]} podcastId={mockPodcastId} />
      </BrowserRouter>
    );

    const rows = screen.getAllByRole('row');
    // Only the header row should be present
    expect(rows).toHaveLength(1);
  });
});
