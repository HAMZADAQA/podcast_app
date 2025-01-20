import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainView from './MainView';
import { usePodcastContext } from '@/context/PodcastContext';
import useFilteredPodcasts from '@/hooks/useFilteredPodcasts';
import {
  mockCachedPodcastData,
  mockFetchError,
} from '@/api/services/__mocks__/podcastMocks';

jest.mock('@/context/PodcastContext', () => ({
  usePodcastContext: jest.fn(),
}));

jest.mock('@/hooks/useFilteredPodcasts', () => jest.fn());

jest.mock('@/components/SearchInput/SearchInput', () => ({
  __esModule: true,
  default: ({ onSearch }: { onSearch: (term: string) => void }) => (
    <input
      data-testid='search-input'
      placeholder='Filter podcasts...'
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

jest.mock('@/components/PodcastList/PodcastList', () => ({
  __esModule: true,
  default: ({ podcasts }: { podcasts: any[] }) => (
    <ul data-testid='podcast-list'>
      {podcasts.map((podcast, index) => (
        <li key={index}>{podcast.name}</li>
      ))}
    </ul>
  ),
}));

jest.mock('@/components/ErrorMessage/ErrorMessage', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid='error-message'>{message}</div>
  ),
}));

describe('MainView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupMockedContext = (podcasts: any[], error: string | null = null) => {
    (usePodcastContext as jest.Mock).mockReturnValue({
      podcasts,
      error,
    });
  };

  const setupFilteredPodcasts = (filteredPodcasts: any[]) => {
    (useFilteredPodcasts as jest.Mock).mockReturnValue(filteredPodcasts);
  };

  it('renders podcasts and allows filtering by search term', () => {
    setupMockedContext(mockCachedPodcastData);
    setupFilteredPodcasts(mockCachedPodcastData);

    render(<MainView />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();

    const podcastList = screen.getByTestId('podcast-list');
    expect(podcastList.children).toHaveLength(mockCachedPodcastData.length);
    expect(screen.getByText('The Joe Budden Podcast')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Joe Budden' } });
    expect(useFilteredPodcasts).toHaveBeenCalledWith(
      mockCachedPodcastData,
      'Joe Budden'
    );
  });

  it('renders an error message if there is an error', () => {
    setupMockedContext([], 'Failed to fetch podcasts');

    render(<MainView />);

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to fetch podcasts');
  });

  it('shows "No Results" when no podcasts match the search term', () => {
    setupMockedContext(mockCachedPodcastData);
    setupFilteredPodcasts([]);

    render(<MainView />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'NonExistentPodcast' } });

    expect(screen.getByAltText('No results found')).toBeInTheDocument();
    expect(screen.getByText(/No podcasts found for/)).toBeInTheDocument();
    expect(screen.getByText(/NonExistentPodcast/)).toBeInTheDocument();
  });

  it('displays the correct count of podcasts based on the search filter', () => {
    const filteredPodcasts = [mockCachedPodcastData[0]];
    setupMockedContext(mockCachedPodcastData);
    setupFilteredPodcasts(filteredPodcasts);

    render(<MainView />);

    const count = screen.getByText(filteredPodcasts.length.toString());
    expect(count).toBeInTheDocument();
  });

  it('handles fetch error gracefully', () => {
    setupMockedContext([], mockFetchError.message);

    render(<MainView />);

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(mockFetchError.message);
  });
});
