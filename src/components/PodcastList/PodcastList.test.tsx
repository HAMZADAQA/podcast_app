import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PodcastList from './PodcastList';
import { mockCachedPodcastData } from '@/api/services/__mocks__/podcastMocks';
import { Podcast } from '@/types/PodcastTypes';

describe('PodcastList Component', () => {
  it('renders nothing when the podcasts array is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <PodcastList podcasts={[]} />
      </MemoryRouter>
    );

    // Ensure no content is rendered
    expect(container.firstChild).toBeNull();
  });

  it('renders the correct number of PodcastItem components when podcasts are provided', () => {
    render(
      <MemoryRouter>
        <PodcastList podcasts={mockCachedPodcastData as Podcast[]} />
      </MemoryRouter>
    );

    // Check that the correct number of PodcastItem components is rendered
    const podcastItems = screen.getAllByRole('listitem');
    expect(podcastItems).toHaveLength(mockCachedPodcastData.length);

    // Verify the rendered content matches the mock data
    mockCachedPodcastData.forEach((podcast) => {
      expect(screen.getByText(podcast.name)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`Author: ${podcast.artist}`, 'i'))
      ).toBeInTheDocument();
    });
  });

  it('renders nothing when podcasts prop is undefined or null', () => {
    const { container } = render(
      <MemoryRouter>
        {/* Passing undefined */}
        <PodcastList podcasts={undefined as unknown as Podcast[]} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();

    const { container: nullContainer } = render(
      <MemoryRouter>
        {/* Passing null */}
        <PodcastList podcasts={null as unknown as Podcast[]} />
      </MemoryRouter>
    );
    expect(nullContainer.firstChild).toBeNull();
  });
});
