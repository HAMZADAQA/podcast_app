import { render, screen } from '@testing-library/react';
import PodcastList from './PodcastList';
import { MemoryRouter } from 'react-router-dom';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks';

beforeAll(() => {
  (global as any).IntersectionObserver = class {
    constructor(callback: any, options?: any) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock(
  '../PodcastItem/PodcastItem',
  () =>
    ({ podcast }: { podcast: any }) => (
      <div data-testid='podcast-item'>{podcast.name}</div>
    )
);
jest.mock('../Skeleton/PodcastItemSkeleton/PodcastItemSkeleton', () => () => (
  <div data-testid='skeleton' />
));

describe('PodcastList', () => {
  it('renders skeletons when loading is true', () => {
    render(
      <MemoryRouter>
        <PodcastList podcasts={mockCachedPodcastData} loading={true} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('skeleton').length).toBe(8);
  });

  it('renders podcasts and a sentinel when podcasts.length > visibleCount', () => {
    const manyPodcasts = Array.from({ length: 25 }, (_, i) => ({
      ...mockCachedPodcastData[0],
      id: String(i + 1),
      name: `Podcast ${i + 1}`,
    }));
    const { container } = render(
      <MemoryRouter>
        <PodcastList podcasts={manyPodcasts} loading={false} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('podcast-item').length).toBe(20);
    const sentinel = container.querySelector('div[style*="20px"]');
    expect(sentinel).toBeInTheDocument();
  });

  it('renders all podcasts and no sentinel when podcasts.length <= visibleCount', () => {
    const fewPodcasts = Array.from({ length: 10 }, (_, i) => ({
      ...mockCachedPodcastData[0],
      id: String(i + 1),
      name: `Podcast ${i + 1}`,
    }));
    const { container } = render(
      <MemoryRouter>
        <PodcastList podcasts={fewPodcasts} loading={false} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('podcast-item').length).toBe(10);
    const sentinel = container.querySelector('div[style*="20px"]');
    expect(sentinel).toBeNull();
  });
});
