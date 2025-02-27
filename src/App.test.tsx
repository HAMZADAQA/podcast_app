import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./pages/MainView/MainView', () => () => (
  <div data-testid='main-view'>MainView</div>
));
jest.mock('./pages/PodcastDetail/PodcastDetail', () => () => (
  <div data-testid='podcast-detail'>PodcastDetail</div>
));
jest.mock('./pages/PodcastEpisode/PodcastEpisode', () => () => (
  <div data-testid='episode-detail'>EpisodeDetail</div>
));
jest.mock('./components/Header/Header', () => () => (
  <div data-testid='header'>Header</div>
));
jest.mock('./components/Spinner/Spinner', () => () => (
  <div data-testid='spinner'>Spinner</div>
));

describe('App', () => {
  it('renders header and main view at root route', async () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId('main-view')).toBeInTheDocument()
    );
  });
});
