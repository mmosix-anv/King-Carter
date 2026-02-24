import React from 'react';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.top}>
        <div className={styles.content}>
          <h1>Want the best in life? Come to<br />the best in the business.</h1>
          <p>We're the world's leading luxury lifestyle group, and we've spent the last 25 years perfecting our private membership offering to be the pinnacle of personalisation and epitome of exclusivity it is today. Here's how our community of like-minded members all live extraordinary lives thanks to a King + Carter membership...</p>
          <button>Apply for membership</button>
        </div>
        <img src="/image/mlvh4yls-tepfzvw.png" alt="" />
      </div>
      <div className={styles.bottom}>
        <div className={styles.feature}>
          <img src="/image/mlvh4yls-lxtsfrn.png" alt="" />
          <h3>Lifestyle management</h3>
          <p>Your very own concierge team dedicated to proactively providing you with whatever you need – wherever and whenever you need it.</p>
        </div>
        <div className={styles.feature}>
          <img src="/image/mlvh4yls-dxj43jb.png" alt="" />
          <h3>Exclusive benefits</h3>
          <p>From complimentary upgrades to money-can't-buy travel perks, your membership unlocks endless exclusive benefits at the world's best luxury brands.</p>
        </div>
        <div className={styles.feature}>
          <img src="/image/mlvh4yls-o3aupqw.png" alt="" />
          <h3>Travel planning</h3>
          <p>Our award-winning in-house travel agency is powered by a team of specialists well-versed in crafting individual itineraries to meet any and all travel dreams.</p>
        </div>
        <div className={styles.feature}>
          <img src="/image/mlvh4yls-ok8a1gv.png" alt="" />
          <h3>Events & access</h3>
          <p>We save you a front-row seat at the world's biggestand most exclusive events, so you can curate a social calendar to suit every season and style.</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
