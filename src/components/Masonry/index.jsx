import React from 'react';
import styles from './Masonry.module.scss';

const Masonry = () => {
  return (
    <div className={styles.masonry}>
      <div className={styles.grid}>
        <div className={`${styles.tile} ${styles.row1col1}`}>
          <img src="/image/mlvh8uho-tdbfkfj.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Lifestyle services</p>
            <h3>Secure a last-minute reservation for an important client</h3>
          </div>
        </div>
        <div className={`${styles.tile} ${styles.row1col2}`}>
          <img src="/image/mlvh8uho-qm8eqap.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Exclusive access</p>
            <h3>Get exclusive VIP access to Taylor Swift's sold-out tour</h3>
          </div>
        </div>
        <div className={`${styles.tile} ${styles.row1col3}`}>
          <img src="/image/mlvh8uho-uykbkw0.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Events &amp; access</p>
            <h3>Accelerate your application to London's hottest private members' clubs</h3>
          </div>
        </div>
        <div className={`${styles.tile} ${styles.row2col1}`}>
          <img src="/image/mlvh8uho-czv7nna.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Wellness</p>
            <h3>Secure a sought-after consultation</h3>
          </div>
        </div>
        <div className={`${styles.tile} ${styles.row2col2}`}>
          <img src="/image/mlvh8uho-n7vbxvi.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Lifestyle services</p>
            <h3>Design a bespoke Rolex watch to gift to your partner</h3>
          </div>
        </div>
        <div className={`${styles.tile} ${styles.row2col3}`}>
          <img src="/image/mlvh8uho-ofqp4jk.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Art</p>
            <h3>Track down a rare piece of art</h3>
          </div>
        </div>
        <div className={`${styles.tile} ${styles.row2col4}`}>
          <img src="/image/mlvh8uho-dvml0pc.png" alt="" />
          <div className={styles.overlay}>
            <p className={styles.eyebrow}>Travel</p>
            <h3>Road trip around America on the back of a motorcycle</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Masonry;
