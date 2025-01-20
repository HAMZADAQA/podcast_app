import React from 'react';
import styles from './Spinner.module.css';

const Spinner: React.FC = () => {
  return (
    <div className={styles.spinnerOverlay} data-testid='spinner-overlay'>
      <div className={styles.spinner} data-testid='spinner'></div>
    </div>
  );
};

export default Spinner;
