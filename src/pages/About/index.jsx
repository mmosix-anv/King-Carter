import React from 'react';
import Layout from '../../components/Layout';
import styles from './index.module.scss';

const About = () => {
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
    </Layout>
  );
};

export default About;
