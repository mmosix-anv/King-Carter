import React from 'react';
import Layout from '../../components/Layout';
import { useSEO } from '../../hooks/useSEO';
import { pageSEO } from '../../config/seo';
import styles from './index.module.scss';

const About = () => {
  useSEO(pageSEO.about);
  return (
    <Layout>
      <div className={styles.heroSection}>
        <div className={styles.imageContainer}>
           <img src="/image/mltlj9k4-63oi0uv.png" alt="City Skyline" className={styles.heroImage} />
           <div className={styles.overlay}></div>
        </div>
        
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>Who We Are</h1>
          
          <div className={styles.textContent}>
            <p className={styles.paragraph}>
              King & Carter's Premier was created to redefine what premium ground transportation can feel like.
            </p>
            
            <p className={styles.paragraph}>
              Inspired by world-class hospitality, we focus on delivering calm, well-coordinated experiences rather than excess. Our approach is simple: show up prepared, communicate clearly, and treat every client with care.
            </p>
            
            <p className={styles.paragraph}>
              Whether serving executives, families, or organizations, our goal remains the same — to make every journey feel effortless.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.philosophySection}>
        <h2 className={styles.philosophyTitle}>Our Philosophy</h2>
        <p className={styles.philosophySubtitle}>We believe luxury is</p>
        
        <div className={styles.valuesRow}>
          <div className={styles.valueItem}>Consistent</div>
          <div className={styles.valueItem}>Considered</div>
          <div className={styles.valueItem}>Human</div>
        </div>

        <div className={styles.lifestyleSection}>
          <div className={styles.portraitColumn}>
            <img src="/image/mltm3drd-dk7hjk9.svg" className={styles.portrait} alt="Portrait Left" />
          </div>
          
          <div className={styles.lifestyleContent}>
            <p className={styles.topQuote}>
              From the way bookings are handled to how drivers present themselves, every interaction reflects our commitment to professionalism and respect. We do not chase trends. We build trust.
            </p>
            
            <h3 className={styles.lifestyleTitle}>A Lifestyle Division</h3>
            
            <p className={styles.lifestyleSubtitle}>
              King & Carter represents a lifestyle shaped by intention, movement, and modern living.
            </p>
            
            <p className={styles.lifestyleDescription}>
              Our clients value quality experiences, thoughtful service, and brands that align with how they live and work. We exist to support that lifestyle quietly, reliably, and with care.
            </p>
            
            <img src="/image/mltm3drg-73xh0hz.png" className={styles.mobilePortrait} alt="Portrait" />
          </div>

          <div className={styles.portraitColumn}>
            <img src="/image/mltmntpb-jklxms9.png" className={styles.portrait} alt="Portrait Right" />
          </div>
        </div>
      </div>

      <div className={styles.imageGridSection}>
        <img src="/image/mltnbtbh-js49sjy.png" className={styles.gridImage} alt="Sailing" />
        <img src="/image/mltnbtbh-14fj04h.png" className={styles.gridImage} alt="Dining" />
        <img src="/image/mltnbtbh-yooz9uh.png" className={styles.gridImage} alt="Nature" />
        <img src="/image/mltnbtbh-bt937q9.png" className={styles.gridImage} alt="Interior" />
      </div>

      <div className={styles.foundersSection}>
        <div className={styles.foundersContent}>
          <h2 className={styles.foundersTitle}>Founder’s Letter</h2>
          <div className={styles.foundersText}>
            <p>
              King & Carter was born from my experiences across hospitality, business, and travel — and from a desire to build something that feels grounded and refined.
            </p>
            <p>
              I wanted to create a transport division that values people, respects time, and delivers service without ego. A brand where clients feel taken care of, not sold to.
            </p>
            <p>
              Luxury, to me, is about intention — doing the right things consistently, even when no one is watching.
            </p>
            <p className={styles.foundersCommitment}>
              King & Carter is my commitment to that standard.
            </p>
            <div className={styles.founderSignature}>
              <p className={styles.founderName}>Karton Zawolo</p>
              <p className={styles.founderRole}>Founder, King & Carter</p>
            </div>
          </div>
        </div>
        <div className={styles.foundersImageContainer}>
          <img src="/image/mltnljp8-pmuqhyu.svg" className={styles.foundersImage} alt="Abstract Shape" />
        </div>
      </div>
    </Layout>
  );
};

export default About;
