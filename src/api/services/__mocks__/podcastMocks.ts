export const mockCachedPodcastData = [
  {
    id: '1535809341',
    name: 'The Joe Budden Podcast',
    artist: 'The Joe Budden Network',
    artwork:
      'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
    summary: 'Tune into Joe Budden and his friends.',
  },
];

export const mockApiPodcastsResponse = {
  feed: {
    entry: [
      {
        id: { attributes: { 'im:id': '1535809341' } },
        'im:name': { label: 'The Joe Budden Podcast' },
        'im:artist': { label: 'The Joe Budden Network' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/55x55bb.png',
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/60x60bb.png',
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
          },
        ],
        summary: { label: 'Tune into Joe Budden and his friends.' },
      },
    ],
  },
};

export const mockCachedPodcastDetails = {
  id: '1535809341',
  artworkUrl600:
    'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/600x600bb.jpg',
  collectionName: 'The Joe Budden Podcast',
  artistName: 'The Joe Budden Network',
  description: 'Tune into Joe Budden and his friends.',
  summary: 'Tune into Joe Budden and his friends.',
  episodes: [
    {
      trackId: 1,
      trackName: 'Episode 790',
      releaseDate: '2025-01-14T20:32:00Z',
      trackTimeMillis: 3600000,
      episodeUrl:
        'https://verifi.podscribe.com/rss/p/traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_790.mp3?dest-id=2422538',
      description: 'Episode 790 description.',
    },
  ],
};

export const mockApiPodcastDetailsResponse = {
  results: [
    {
      collectionName: 'The Joe Budden Podcast',
      artistName: 'The Joe Budden Network',
      artworkUrl600:
        'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/600x600bb.jpg',
      description: 'Tune into Joe Budden and his friends.',
      summary: 'Tune into Joe Budden and his friends.',
    },
    {
      trackId: 1,
      trackName: 'Episode 790',
      releaseDate: '2025-01-14T20:32:00Z',
      trackTimeMillis: 3600000,
      episodeUrl:
        'https://verifi.podscribe.com/rss/p/traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_790.mp3?dest-id=2422538',
      description: 'Episode 790 description.',
    },
  ],
};

export const mockInvalidJsonResponse = {
  contents: 'Invalid JSON',
};

export const mockFetchError = new Error('Fetch failed');

export const mockHttpErrorResponse = {
  ok: false,
  status: 404,
};
