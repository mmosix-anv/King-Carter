import React from 'react';
import Layout from '../../components/Layout';
import styles from './index.module.scss';

const ServiceDetails = () => {
  return (
    <Layout>
      <div className={styles.serviceDetails}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Private Luxury Transport</h1>
          </div>
        </div>

        <div className={styles.description}>
          <p className={styles.designedForIndividua3}>
            <span className={styles.designedForIndividua}>
              Designed for individuals and families
              <br />
            </span>
            <span className={styles.designedForIndividua2}>
              seeking comfort, privacy, and reliability.
            </span>
          </p>
          <p className={styles.loremIpsumDolorSitAm4}>
            <span className={styles.loremIpsumDolorSitAm}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
              nibh euismod tincidunt ut
              <br />
            </span>
            <span className={styles.loremIpsumDolorSitAm2}>
              laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
              quis nostrud exerci tation ullam-
              <br />
            </span>
            <span className={styles.loremIpsumDolorSitAm3}>
              corper suscipit lobortistiocommodonostrud exerci tation ullamcorper
              suscipit lobortis nisl ut aliquip ex ea
              <br />
            </span>
            <span className={styles.loremIpsumDolorSitAm2}>
              commodo consequat. Duis autem vel eum iriure dolor in hendrerit in
              vulputate velit esse molestie conse
            </span>
          </p>
        </div>

        <div className={styles.gallery}>
          <div className={styles.galleryItemPrimary}>
            <img
              src="/image/mltqxr0s-tvy6qwy.png"
              className={styles.galleryImage}
              alt="Estate drive with luxury vehicle"
            />
          </div>

          <div className={styles.galleryItem}>
            <img
              src="/image/mltqxr0s-0ykx36e.png"
              className={styles.galleryImage}
              alt="Luxury white convertible"
            />
          </div>
          <div className={styles.galleryItem}>
            <img
              src="/image/mltqxr0s-5bj4l8e.png"
              className={styles.galleryImage}
              alt="Architectural archway"
            />
          </div>
          <div className={styles.galleryItem}>
            <img
              src="/image/mltqxr0s-koo2o1u.png"
              className={styles.galleryImage}
              alt="City skyline at night"
            />
          </div>
          <div className={styles.galleryItem}>
            <img
              src="/image/mltqxr0s-hynsmyb.png"
              className={styles.galleryImage}
              alt="Luxury SUV in motion"
            />
          </div>
          <div className={styles.galleryItem}>
            <img
              src="/image/mltqxr0s-3fog7d9.png"
              className={styles.galleryImage}
              alt="Black grand tourer front view"
            />
          </div>
          <div className={styles.galleryItem}>
            <img
              src="/image/mltqxr0s-ch5rmk1.png"
              className={styles.galleryImage}
              alt="Gallery event space"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ServiceDetails;
