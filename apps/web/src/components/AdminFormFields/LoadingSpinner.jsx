import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = ({ 
  overlay = false,
  size = 'medium',
  message = ''
}) => {
  const spinnerContent = (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.spinnerCircle}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className={styles.overlay} role="status" aria-live="polite">
        {spinnerContent}
        <span className={styles.srOnly}>Loading...</span>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite">
      {spinnerContent}
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  overlay: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string
};

export default LoadingSpinner;
