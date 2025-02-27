import { render, screen } from '@testing-library/react';
import { PodcastProvider, usePodcastContext } from './PodcastContext';

const ConsumerComponent: React.FC = () => {
  const { podcasts, podcastsLoading, podcastsError } = usePodcastContext();

  return (
    <div>
      <div data-testid='loading'>
        {podcastsLoading ? 'Loading' : 'Not Loading'}
      </div>
      <div data-testid='error'>{podcastsError || 'No Error'}</div>
      <div data-testid='podcasts'>{podcasts.length}</div>
    </div>
  );
};

describe('PodcastContext', () => {
  it('provides context values to children', () => {
    render(
      <PodcastProvider>
        <ConsumerComponent />
      </PodcastProvider>
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    expect(screen.getByTestId('podcasts')).toBeInTheDocument();
  });
});
