import React from 'react';
import PodcastImage from '../PodcastImage/PodcastImage';
import styles from './PodcastCard.module.css';

interface PodcastCardProps {
  image: string;
  title: string;
  author?: string;
  description?: string;
  descriptionLabel?: string;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  image,
  title,
  author,
  description,
  descriptionLabel = 'Description:',
}) => {
  return (
    <div className={styles.card}>
      <PodcastImage src={image} alt={title} className={styles.image} />
      <div className={styles.borderBottom}></div>
      <h2 className={styles.title}>{title}</h2>
      {author && <p className={styles.author}>By {author}</p>}
      <div className={styles.borderBottom}></div>
      {description && (
        <>
          <h5>{descriptionLabel}</h5>
          <p className={styles.description}>{description}</p>
        </>
      )}
    </div>
  );
};
export default PodcastCard;
