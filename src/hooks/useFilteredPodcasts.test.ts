import { renderHook } from '@testing-library/react';
import useFilteredPodcasts from '@/hooks/useFilteredPodcasts';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks';

describe('useFilteredPodcasts', () => {
  it('returns all podcasts when no search term is provided', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockCachedPodcastData, '')
    );

    expect(result.current).toEqual(mockCachedPodcastData);
  });

  it('filters podcasts by name', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockCachedPodcastData, 'Joe')
    );

    expect(result.current).toEqual([
      {
        id: '1535809341',
        name: 'The Joe Budden Podcast',
        artist: 'The Joe Budden Network',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
        summary: 'Tune into Joe Budden and his friends.',
      },
    ]);
  });

  it('filters podcasts by artist', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockCachedPodcastData, 'The Joe Budden Network')
    );

    expect(result.current).toEqual([
      {
        id: '1535809341',
        name: 'The Joe Budden Podcast',
        artist: 'The Joe Budden Network',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
        summary: 'Tune into Joe Budden and his friends.',
      },
    ]);
  });

  it('is case insensitive when filtering', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockCachedPodcastData, 'joE buDDen')
    );

    expect(result.current).toEqual([
      {
        id: '1535809341',
        name: 'The Joe Budden Podcast',
        artist: 'The Joe Budden Network',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
        summary: 'Tune into Joe Budden and his friends.',
      },
    ]);
  });

  it('returns an empty array when no podcasts match the search term', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockCachedPodcastData, 'Nonexistent')
    );

    expect(result.current).toEqual([]);
  });
});
