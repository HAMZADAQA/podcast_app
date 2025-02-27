import { render, screen } from '@testing-library/react';
import PodcastEpisode from './PodcastEpisode';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';
import { mockCachedPodcastDetails } from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/hooks/usePodcastDetail');
jest.mock('@/components/PodcastCard/PodcastCard', () => (props: any) => (
  <div data-testid='podcast-card'>{props.title}</div>
));
jest.mock('@/components/ErrorMessage/ErrorMessage', () => (props: any) => (
  <div data-testid='error-message'>{props.message}</div>
));

describe('PodcastEpisode', () => {
  const mockedUsePodcastDetail = usePodcastDetail as jest.Mock;

  it('renders error message when no podcastId is provided', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: null,
      podcastDetail: null,
    });
    render(
      <MemoryRouter initialEntries={['/podcast/episode/1']}>
        <PodcastEpisode />
      </MemoryRouter>
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'No podcast selected.'
    );
  });

  it('renders loading message when podcastDetail is null', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: '1535809341',
      podcastDetail: null,
    });
    render(
      <MemoryRouter initialEntries={['/podcast/episode/1']}>
        <PodcastEpisode />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading episode details...')).toBeInTheDocument();
  });

  it('renders error message when episode is not found', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: '1535809341',
      podcastDetail: { ...mockCachedPodcastDetails, episodes: [] },
    });
    render(
      <MemoryRouter initialEntries={['/podcast/episode/1']}>
        <PodcastEpisode />
      </MemoryRouter>
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Episode not found.'
    );
  });

  it('renders PodcastCard and episode details when episode is found', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: '1535809341',
      podcastDetail: mockCachedPodcastDetails,
    });
    render(
      <MemoryRouter initialEntries={['/podcast/episode/1']}>
        <Routes>
          <Route
            path='/podcast/episode/:episodeId'
            element={<PodcastEpisode />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('podcast-card')).toHaveTextContent(
      'The Joe Budden Podcast'
    );
    expect(screen.getByText('Episode 790')).toBeInTheDocument();
    const audioSource = screen.getByTestId('audio-source');
    expect(audioSource).toHaveAttribute(
      'src',
      'https://verifi.podscribe.com/rss/p/traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_790.mp3?dest-id=2422538'
    );
  });
});
