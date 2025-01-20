import React from 'react';
import styles from './PodcastImage.module.css';

interface PodcastImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PodcastImage: React.FC<PodcastImageProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.podcastImage} ${className || ''}`.trim()}
    />
  );
};

export default PodcastImage;
