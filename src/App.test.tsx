import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { PodcastProvider } from './context/PodcastContext';

// Mock lazy-loaded components with proper type
jest.mock('./pages/MainView/MainView', () => ({
  __esModule: true,
  default: () => <div data-testid='main-view'>MainView Component</div>,
}));
jest.mock('./pages/PodcastDetail/PodcastDetail', () => ({
  __esModule: true,
  default: () => (
    <div data-testid='podcast-detail'>PodcastDetail Component</div>
  ),
}));
jest.mock('./pages/PodcastEpisode/PodcastEpisode', () => ({
  __esModule: true,
  default: () => (
    <div data-testid='episode-detail'>EpisodeDetail Component</div>
  ),
}));

// Mock the Spinner
jest.mock('./components/Spinner/Spinner', () => ({
  __esModule: true,
  default: () => (
    <div className='spinner' data-testid='spinner'>
      Loading...
    </div>
  ),
}));

// Mock the Header
jest.mock('./components/Header/Header', () => ({
  __esModule: true,
  default: () => (
    <header data-testid='header'>
      <a href='/' className='title'>
        Podcaster
      </a>
    </header>
  ),
}));

describe('App Component', () => {
  const renderApp = () => {
    render(
      <PodcastProvider>
        <App />
      </PodcastProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the Spinner while a lazy-loaded component is loading', async () => {
    renderApp();

    // Verify the Spinner is rendered during the loading phase
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for the MainView component to load
    await waitFor(() =>
      expect(screen.getByTestId('main-view')).toBeInTheDocument()
    );

    // Verify the Spinner is removed after loading
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('renders the MainView component at the root route ("/")', async () => {
    window.history.pushState({}, 'Root Route', '/');
    renderApp();
    expect(await screen.findByTestId('main-view')).toBeInTheDocument();
  });

  it('renders the PodcastDetail component at the "/podcast/:podcastId" route', async () => {
    window.history.pushState({}, 'Podcast Detail Route', '/podcast/1234');
    renderApp();
    expect(await screen.findByTestId('podcast-detail')).toBeInTheDocument();
  });

  it('renders the EpisodeDetail component at the "/podcast/:podcastId/episode/:episodeId" route', async () => {
    window.history.pushState(
      {},
      'Episode Detail Route',
      '/podcast/1234/episode/5678'
    );
    renderApp();
    expect(await screen.findByTestId('episode-detail')).toBeInTheDocument();
  });
});
