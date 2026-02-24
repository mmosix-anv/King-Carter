import React from 'react';
import styles from './AppDownload.module.scss';

const AppDownload = () => {
  return (
    <div className={styles.section}>
      <div className={styles.content}>
        <h2>Unlock a world of luxury at your fingertips...</h2>
        <p>...with the King + Carter members' portal. Available on web and as an app, this is where you can seek inspiration for a luxury lifestyle at your leisure. Every feature has been thoughtfully designed to help you make the most of your membership.</p>
        <div className={styles.badges}>
          <img src="/image/mlvh9b9f-98cxfmi.svg" alt="App Store" />
          <img src="/image/mlvh9b9f-d9g4n6n.png" alt="Google Play" />
        </div>
        <button>Apply for membership</button>
      </div>
      <img src="/image/mlvh9b9f-hix83ve.png" alt="Devices" />
    </div>
  );
};

export default AppDownload;
