import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import InfoSection from '../../components/InfoSection';
import Masonry from '../../components/Masonry';
import Testimonials from '../../components/Testimonials';
import AppDownload from '../../components/AppDownload';
import MapSection from '../../components/MapSection';
import { useSEO } from '../../hooks/useSEO';
import { pageSEO } from '../../config/seo';

const Membership = () => {
  useSEO(pageSEO.membership);
  return (
    <Layout>
      <Hero />
      <InfoSection />
      <Masonry />
      <Testimonials />
      <AppDownload />
      <MapSection />
    </Layout>
  );
};

export default Membership;
