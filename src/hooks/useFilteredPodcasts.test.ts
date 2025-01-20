import { renderHook } from '@testing-library/react';
import useFilteredPodcasts from '@/hooks/useFilteredPodcasts';
import { Podcast } from '@/types/PodcastTypes';

const mockPodcasts: Podcast[] = [
  {
    id: '1',
    name: 'Tech Talk',
    artist: 'Tech Guru',
    artwork: 'https://example.com/image1.jpg',
    summary: 'A podcast about tech.',
  },
  {
    id: '2',
    name: 'Health Matters',
    artist: 'Wellness Pro',
    artwork: 'https://example.com/image2.jpg',
    summary: 'Discussions on health and wellness.',
  },
  {
    id: '3',
    name: 'The Joe Budden Podcast',
    artist: 'The Joe Budden Network',
    artwork: 'https://example.com/image3.jpg',
    summary: 'Tune into Joe Budden and his friends.',
  },
];

describe('useFilteredPodcasts', () => {
  it('returns all podcasts when no search term is provided', () => {
    const { result } = renderHook(() => useFilteredPodcasts(mockPodcasts, ''));

    expect(result.current).toEqual(mockPodcasts);
  });

  it('filters podcasts by name', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockPodcasts, 'Tech')
    );

    expect(result.current).toEqual([
      {
        id: '1',
        name: 'Tech Talk',
        artist: 'Tech Guru',
        artwork: 'https://example.com/image1.jpg',
        summary: 'A podcast about tech.',
      },
    ]);
  });

  it('filters podcasts by artist', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockPodcasts, 'Joe Budden')
    );

    expect(result.current).toEqual([
      {
        id: '3',
        name: 'The Joe Budden Podcast',
        artist: 'The Joe Budden Network',
        artwork: 'https://example.com/image3.jpg',
        summary: 'Tune into Joe Budden and his friends.',
      },
    ]);
  });

  it('is case insensitive when filtering', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockPodcasts, 'joE buDDen')
    );

    expect(result.current).toEqual([
      {
        id: '3',
        name: 'The Joe Budden Podcast',
        artist: 'The Joe Budden Network',
        artwork: 'https://example.com/image3.jpg',
        summary: 'Tune into Joe Budden and his friends.',
      },
    ]);
  });

  it('returns an empty array when no podcasts match the search term', () => {
    const { result } = renderHook(() =>
      useFilteredPodcasts(mockPodcasts, 'Nonexistent')
    );

    expect(result.current).toEqual([]);
  });
});
