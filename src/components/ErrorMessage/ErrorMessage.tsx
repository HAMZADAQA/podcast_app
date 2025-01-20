import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  retryAction?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  retryAction,
}) => {
  return (
    <div className={styles.errorContainer} data-testid='error-message'>
      <p className={styles.errorMessage}>{message}</p>
      {retryAction && (
        <button className={styles.retryButton} onClick={retryAction}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
