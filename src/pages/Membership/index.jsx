import React from 'react';
import Layout from '../../components/Layout';
import styles from './index.module.scss';

const Membership = () => {
  return (
    <Layout>
      <div className={styles.membership}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span>Want the best in life? Come to</span>
              <br />
              <span>the best in the business.</span>
            </h1>
            <p className={styles.heroText}>
              We're the world's leading luxury lifestyle group, and we've spent the last 25 years perfecting our private membership 
              offering to be the pinnacle of personalisation and epitome of exclusivity it is today. Here's how our community of 
              like-minded members all live extraordinary lives thanks to a Quintessentially membership...
            </p>
            <button className={styles.applyBtn}>Apply for membership</button>
          </div>
          <div className={styles.heroImage}>
            <img src="/image/mlvh4yls-tepfzvw.png" alt="Couple dining" />
          </div>
        </section>
      </div>
        <section className={styles.infoSection}>
          <div className={styles.infoInner}>
            <div className={styles.infoLeft}>
              <div className={styles.infoHeader}>
                <div className={styles.infoIcon}>
                  <img src="/image/mlvh8afi-gj40nag.svg" alt="Hourglass icon" />
                  <p>Your time, saved.</p>
                </div>
                <div className={styles.infoIcon}>
                  <img src="/image/mlvh8afi-7q0q0zz.svg" alt="Donut icon" />
                  <p>Your experience, personalised.</p>
                </div>
                <div className={styles.infoIcon}>
                  <img src="/image/mlvh8afh-xsapogi.svg" alt="Globe icon" />
                  <p>Your support, global.</p>
                </div>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>24/7 concierge support from your lifestyle manager</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Be invited to private, member-only events and experiences</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>RSVP the world’s biggest and most exclusive events</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Tap into our unrivalled global network of luxury partners</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Make the most of your bespoke member benefits</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Tuck into recommendations and priority reservations at sought-after restaurants</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Travel the world with tailored itineraries and perks from our in‑house agency</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Receive expert day‑to‑day assistance on everything from real estate to education</p>
                </div>
                <div className={styles.infoItem}>
                  <img src="/image/mlvh8afh-ukus8at.png" alt="check" />
                  <p>Feel secure with our discreet and fully confidential service</p>
                </div>
              </div>
            </div>

            <div className={styles.infoImage}>
              <img src="/image/mlvh8afk-5kon9jy.png" alt="Aerial luxury destination" />
            </div>
          </div>
        </section>

        <section className={styles.masonrySection}>
          <div className={styles.masonryGrid}>
            <div className={styles.tileWide}>
              <img src="/image/mlvh8uho-qm8eqap.png" alt="Exclusive access" />
              <div className={styles.tileOverlay}>
                <p className={styles.tileEyebrow}>Exclusive access</p>
                <h3 className={styles.tileTitle}>Get exclusive VIP access to Taylor Swift’s sold‑out tour</h3>
              </div>
            </div>
            <div className={styles.tileTall}>
              <img src="/image/mlvh8uho-uykbkw0.png" alt="Events & access" />
              <div className={styles.tileOverlayBottom}></div>
            </div>
            <div className={styles.tile}>
              <img src="/image/mlvh8uho-r0jmgx0.png" alt="Art" />
              <div className={styles.tileOverlay}>
                <p className={styles.tileEyebrow}>Art</p>
                <h3 className={styles.tileTitle}>Track down a rare piece of art</h3>
              </div>
            </div>
            <div className={styles.tile}>
              <img src="/image/mlvh8uho-uykbkw0.png" alt="Events & access" />
              <div className={styles.tileOverlay}>
                <p className={styles.tileEyebrow}>Events &amp; access</p>
                <h3 className={styles.tileTitle}>Accelerate your application to London’s hottest private members’ clubs</h3>
              </div>
            </div>
            <div className={styles.tile}>
              <img src="/image/mlvh8uho-r0jmgx0.png" alt="Travel" />
              <div className={styles.tileOverlay}>
                <p className={styles.tileEyebrow}>Travel</p>
                <h3 className={styles.tileTitle}>Road trip around America on the back of a motorcycle</h3>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.appSection}>
          <div className={styles.appInner}>
            <div className={styles.appCopy}>
              <h2 className={styles.appHeading}>Unlock a world of luxury at your fingertips…</h2>
              <p className={styles.appText}>
                …with the Quintessentially members’ portal. Available on web and as an app, this is where you can seek
                inspiration for a luxury lifestyle at your leisure. Every feature has been thoughtfully designed to help you
                make the most of your membership.
              </p>
              <div className={styles.appBadges}>
                <img src="/image/mlvh9b9f-98cxfmi.svg" alt="Download on the App Store" />
                <img src="/image/mlvh9b9f-d9g4n6n.png" alt="Get it on Google Play" />
              </div>
              <button className={styles.applyBtn}>Apply for membership</button>
            </div>
            <div className={styles.appDevices}>
              <img src="/image/mlvh9b9f-hix83ve.png" alt="Member portal devices" />
            </div>
          </div>
        </section>

        <section className={styles.mapSection}>
          <div className={styles.mapInner}>
            <h2 className={styles.mapHeading}>Wherever you are, we are.</h2>
            <p className={styles.mapText}>
              We’re as global as it gets, with 40 offices worldwide. We speak your language, literally (54, to be precise).
              We’re the world’s largest luxury concierge group, and we’re here for you wherever you are, whenever you need us.
            </p>
            <img className={styles.worldMap} src="/image/mlvh9or1-iiipc18.png" alt="World map with office locations" />
          </div>
        </section>

    </Layout>
  );
};

export default Membership;
