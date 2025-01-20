import React from 'react';
import { render, screen } from '@testing-library/react';
import PodcastCard from './PodcastCard';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks'; // Adjust the path to your mock file

describe('PodcastCard Component', () => {
  const mockPodcast = mockCachedPodcastData[0]; // Use the first podcast from your mock data

  it('renders all required elements', () => {
    render(
      <PodcastCard
        image={mockPodcast.artwork}
        title={mockPodcast.name}
        author={mockPodcast.artist}
        description={mockPodcast.summary}
        descriptionLabel='Summary:'
      />
    );

    // Verify the image is rendered
    const image = screen.getByAltText(mockPodcast.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPodcast.artwork);

    // Verify the title
    expect(screen.getByText(mockPodcast.name)).toBeInTheDocument();

    // Verify the author
    expect(screen.getByText(`By ${mockPodcast.artist}`)).toBeInTheDocument();

    // Verify the description and its label
    expect(screen.getByText('Summary:')).toBeInTheDocument();
    expect(screen.getByText(mockPodcast.summary)).toBeInTheDocument();
  });

  it('renders without author and description', () => {
    render(
      <PodcastCard image={mockPodcast.artwork} title={mockPodcast.name} />
    );

    // Verify the image
    expect(screen.getByAltText(mockPodcast.name)).toBeInTheDocument();

    // Verify the title
    expect(screen.getByText(mockPodcast.name)).toBeInTheDocument();

    // Ensure author and description are not rendered
    expect(screen.queryByText(/By/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Description:/)).not.toBeInTheDocument();
  });

  it('uses default description label when not provided', () => {
    render(
      <PodcastCard
        image={mockPodcast.artwork}
        title={mockPodcast.name}
        author={mockPodcast.artist}
        description={mockPodcast.summary}
      />
    );

    // Verify the default description label
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText(mockPodcast.summary)).toBeInTheDocument();
  });

  it('renders custom description label when provided', () => {
    render(
      <PodcastCard
        image={mockPodcast.artwork}
        title={mockPodcast.name}
        author={mockPodcast.artist}
        description={mockPodcast.summary}
        descriptionLabel='Podcast Summary:'
      />
    );

    // Verify the custom description label
    expect(screen.getByText('Podcast Summary:')).toBeInTheDocument();
    expect(screen.getByText(mockPodcast.summary)).toBeInTheDocument();
  });
});
