import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PodcastItem from './PodcastItem';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks'; // Adjust path as necessary

const mockPodcast = mockCachedPodcastData[0]; // Use the first podcast from the mock data

describe('PodcastItem Component', () => {
  it('renders the podcast name as a link', () => {
    render(
      <BrowserRouter>
        <PodcastItem podcast={mockPodcast} />
      </BrowserRouter>
    );

    const linkElement = screen.getByRole('link', { name: mockPodcast.name });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/podcast/${mockPodcast.id}`);
  });

  it('renders the podcast artist name', () => {
    render(
      <BrowserRouter>
        <PodcastItem podcast={mockPodcast} />
      </BrowserRouter>
    );

    const artistElement = screen.getByText(`Author: ${mockPodcast.artist}`);
    expect(artistElement).toBeInTheDocument();
  });

  it('renders the podcast artwork image', () => {
    render(
      <BrowserRouter>
        <PodcastItem podcast={mockPodcast} />
      </BrowserRouter>
    );

    const imageElement = screen.getByAltText(mockPodcast.name);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockPodcast.artwork);
  });
});
