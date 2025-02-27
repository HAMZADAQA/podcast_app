import { render, screen } from '@testing-library/react';
import PodcastDetail from './PodcastDetail';
import { MemoryRouter } from 'react-router-dom';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';
import { mockCachedPodcastDetails } from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/hooks/usePodcastDetail');
jest.mock('@/components/PodcastCard/PodcastCard', () => (props: any) => (
  <div data-testid='podcast-card'>{props.title}</div>
));
jest.mock('@/components/EpisodeTable/EpisodeTable', () => (props: any) => (
  <div data-testid='episode-table'>Episodes: {props.episodes.length}</div>
));
jest.mock('@/components/ErrorMessage/ErrorMessage', () => (props: any) => (
  <div data-testid='error-message'>{props.message}</div>
));

describe('PodcastDetail', () => {
  const mockedUsePodcastDetail = usePodcastDetail as jest.Mock;

  it('renders error message when no podcastId is provided', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: null,
      podcastDetail: null,
    });
    render(
      <MemoryRouter>
        <PodcastDetail />
      </MemoryRouter>
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'No podcast selected.'
    );
  });

  it('renders nothing when podcastId is provided but podcastDetail is null', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: '1535809341',
      podcastDetail: null,
    });
    const { container } = render(
      <MemoryRouter>
        <PodcastDetail />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders PodcastCard and EpisodeTable when podcastDetail is provided', () => {
    mockedUsePodcastDetail.mockReturnValue({
      podcastId: '1535809341',
      podcastDetail: mockCachedPodcastDetails,
    });
    render(
      <MemoryRouter>
        <PodcastDetail />
      </MemoryRouter>
    );
    expect(screen.getByTestId('podcast-card')).toHaveTextContent(
      'The Joe Budden Podcast'
    );
    expect(screen.getByTestId('episode-table')).toHaveTextContent(
      'Episodes: 1'
    );
  });
});
