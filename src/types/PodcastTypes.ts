export interface Podcast {
  id: string;
  name: string;
  artist: string;
  artwork: string;
  summary: string;
}

export interface Episode {
  trackId: number;
  trackName: string;
  releaseDate: string;
  trackTimeMillis: number;
  episodeUrl: string;
  description: string;
}

export interface DetailedPodcast {
  id: string;
  artworkUrl600: string;
  collectionName: string;
  artistName: string;
  summary: string;
  description: string;
  episodes: Episode[];
}
