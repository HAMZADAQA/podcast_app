import { render, screen, fireEvent } from '@testing-library/react';
import MainView from './MainView';
import { PodcastContext } from '@/context/PodcastContext';
import { MemoryRouter } from 'react-router-dom';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/hooks/useFilteredPodcasts', () => {
  return jest.fn((podcasts, searchTerm) => {
    if (!searchTerm) return podcasts;
    return podcasts.filter((p: { name: string }) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
});

jest.mock('@/components/SearchInput/SearchInput', () => (props: any) => (
  <input
    data-testid='search-bar'
    onChange={(e) => props.onSearch(e.target.value)}
  />
));

jest.mock('@/components/PodcastList/PodcastList', () => (props: any) => (
  <div data-testid='podcast-list'>PodcastList: {props.podcasts.length}</div>
));

jest.mock('@/components/ErrorMessage/ErrorMessage', () => (props: any) => (
  <div data-testid='error-message'>{props.message}</div>
));

describe('MainView', () => {
  const contextValue = {
    podcasts: mockCachedPodcastData,
    podcastsLoading: false,
    podcastsError: null,
    podcastDetails: {},
    fetchPodcastDetail: async () => {},
  };

  it('renders PodcastList when searchTerm is empty', () => {
    render(
      <PodcastContext.Provider value={contextValue}>
        <MemoryRouter>
          <MainView />
        </MemoryRouter>
      </PodcastContext.Provider>
    );
    expect(screen.getByTestId('podcast-list')).toHaveTextContent(
      'PodcastList: 1'
    );
  });

  it('renders no results message when searchTerm is non-empty and no podcasts match', () => {
    render(
      <PodcastContext.Provider value={contextValue}>
        <MemoryRouter>
          <MainView />
        </MemoryRouter>
      </PodcastContext.Provider>
    );
    const searchInput = screen.getByTestId('search-bar');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    expect(screen.getByAltText('No results found')).toBeInTheDocument();
    expect(screen.getByText(/No podcasts found for/)).toHaveTextContent(
      'NonExistent'
    );
  });

  it('renders ErrorMessage when podcastsError is present', () => {
    const errorContext = {
      ...contextValue,
      podcastsError: 'Error occurred',
    };
    render(
      <PodcastContext.Provider value={errorContext}>
        <MemoryRouter>
          <MainView />
        </MemoryRouter>
      </PodcastContext.Provider>
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Error occurred'
    );
  });
});
