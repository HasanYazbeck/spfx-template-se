import * as React from 'react';
import styles from '../../components/Spfx.module.scss';

export const Loader = (): JSX.Element => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <div className={styles.loaderSpinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        <p className={styles.loaderText}>Loading your data be patient...</p>
      </div>
    </div>
  );
};