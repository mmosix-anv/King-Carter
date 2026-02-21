import React from 'react';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import InfoSection from '../../components/InfoSection';
import Masonry from '../../components/Masonry';
import Testimonials from '../../components/Testimonials';
import AppDownload from '../../components/AppDownload';
import MapSection from '../../components/MapSection';

const Membership = () => {
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
