import React from 'react';
import { render, screen } from '@testing-library/react';
import EpisodeTable from './EpisodeTable';
import { MemoryRouter } from 'react-router-dom';

describe('EpisodeTable', () => {
  const podcastId = '1535809341';

  it('renders nothing when episodes array is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <EpisodeTable episodes={[]} podcastId={podcastId} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders table headings and episode rows correctly', () => {
    const episodes = [
      {
        trackId: 1,
        trackName: 'Episode 790',
        releaseDate: '2025-01-14',
        trackTimeMillis: '1 hr 0 min' as any,
        episodeUrl:
          'https://verifi.podscribe.com/rss/p/traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_790.mp3?dest-id=2422538',
        description: 'Episode 790 description.',
      },
      {
        trackId: 2,
        trackName: 'Episode 791',
        releaseDate: '2025-01-15',
        trackTimeMillis: '1:05' as any,
        episodeUrl: 'https://example.com/episode791.mp3',
        description: 'Episode 791 description.',
      },
    ];

    render(
      <MemoryRouter>
        <EpisodeTable episodes={episodes} podcastId={podcastId} />
      </MemoryRouter>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Episode 790')).toBeInTheDocument();
    expect(screen.getByText('2025-01-14')).toBeInTheDocument();
    expect(screen.getByText('1 hr 0 min')).toBeInTheDocument();
    expect(screen.getByText('Episode 791')).toBeInTheDocument();
    expect(screen.getByText('2025-01-15')).toBeInTheDocument();
    expect(screen.getByText('1:05')).toBeInTheDocument();

    const link1 = screen.getByRole('link', { name: 'Episode 790' });
    expect(link1).toHaveAttribute('href', `/podcast/${podcastId}/episode/1`);

    const link2 = screen.getByRole('link', { name: 'Episode 791' });
    expect(link2).toHaveAttribute('href', `/podcast/${podcastId}/episode/2`);
  });
});
