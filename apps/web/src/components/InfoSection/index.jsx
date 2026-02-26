import React from 'react';
import styles from './InfoSection.module.scss';

const InfoSection = () => {
  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <div className={styles.icons}>
          <div className={styles.icon}>
            <img src="/image/mlvh8afi-gj40nag.svg" alt="" />
            <p>Your time, saved.</p>
          </div>
          <div className={styles.icon}>
            <img src="/image/mlvh8afi-7q0q0zz.svg" alt="" />
            <p>Your experience, personalised.</p>
          </div>
          <div className={styles.icon}>
            <img src="/image/mlvh8afh-xsapogi.svg" alt="" />
            <p>Your support, global.</p>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>24/7 concierge support from your lifestyle manager</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Be invited to private, member-only events and experiences</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>RSVP the world's biggest and most exclusive events</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Tap into our unrivalled global network of luxury partners</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Make the most of your bespoke member benefits</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Tuck into recommendations and priority reservations at sought-after restaurants</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Travel the world with tailored itineraries and perks from our in‑house agency</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Receive expert day‑to‑day assistance on everything from real estate to education</p>
          </div>
          <div className={styles.item}>
            <img src="/image/mlvh8afh-ukus8at.png" alt="" />
            <p>Feel secure with our discreet and fully confidential service</p>
          </div>
        </div>
        <div className={styles.footer}>
          <p>But our full offering of <span>specialist services</span> doesn't end there. So, apply for membership via the button below to fill out a form and we'll be in touch to discuss membership options tailored to your needs.</p>
          <button>Apply for membership</button>
        </div>
      </div>
      <img src="/image/mlvh8afk-5kon9jy.png" alt="" />
    </div>
  );
};

export default InfoSection;
