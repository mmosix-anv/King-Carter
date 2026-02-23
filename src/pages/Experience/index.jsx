import React from 'react';
import Layout from '../../components/MiniLayout';
import MembershipServices from '../../components/MembershipServices';
import BusinessServices from '../../components/BusinessServices';
import Testimonials from '../../components/Testimonials';
import ContactForm from '../../components/ContactForm';
import { countries } from '../../data/countries';
import { useSEO } from '../../hooks/useSEO';
import { pageSEO } from '../../config/seo';
import styles from './index.module.scss';

const Experience = () => {
  useSEO(pageSEO.experience);
  return (
    <Layout>
      <div className={styles.experience}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <span>Expect the best.</span>
                <br />
                <span>Experience better.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                For 25 years we have been the ultimate destination for discerning individuals and
                businesses seeking industry-leading concierge services worldwide. From exclusive
                access to travel planning, our lifestyle managers do it all with unparalleled
                personalisation and attention to detail. We don't just save you time and effort, we
                elevate every aspect of your life.
              </p>
              <div className={styles.heroActions}>
                <button type="button" className={styles.secondaryCta}>
                  Become a member
                </button>
                <button type="button" className={styles.secondaryCta}>
                  Corporate membership
                </button>
              </div>
            </div>
            <div className={styles.heroImageWrapper}>
              <img
                src="/image/mlswdjno-cf5rp6i.png"
                alt="Guest overlooking a scenic landscape"
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.cardSection}>
          <div className={styles.cardGrid}>
            <article className={styles.card}>
              <div className={styles.cardMedia}>
                <img
                  src="/image/mlurno5w-9oadrei.png"
                  alt="Private membership"
                />
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Private membership</h2>
                <p className={styles.cardText}>
                  Bespoke concierge and lifestyle management services for discerning individuals
                  seeking highly personalised, one-to-one attention, access to the inaccessible, and
                  the invaluable gift of time.
                </p>
                <button type="button" className={styles.cardCta}>
                  Learn more
                </button>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardMedia}>
                <img
                  src="/image/mlurno5w-ndxzwwf.png"
                  alt="Corporate membership"
                />
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Corporate membership</h2>
                <p className={styles.cardText}>
                  Extending our service beyond individuals, we leverage our unique positioning to
                  help brands and businesses better serve and connect with their audiences and staff.
                </p>
                <button type="button" className={styles.cardCta}>
                  Learn more
                </button>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardMedia}>
                <img
                  src="/image/mlurno5w-ndxzwwf.png"
                  alt="Corporate membership"
                />
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Corporate membership</h2>
                <p className={styles.cardText}>
                  Extending our service beyond individuals, we leverage our unique positioning to
                  help brands and businesses better serve and connect with their audiences and staff.
                </p>
                <button type="button" className={styles.cardCta}>
                  Learn more
                </button>
              </div>
            </article>
          </div>
        </section>

        <MembershipServices />
        <BusinessServices />
        <Testimonials />
        <ContactForm />
      </div>
    </Layout>
  );
};

export default Experience;
