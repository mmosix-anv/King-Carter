/**
 * King & Carter — Executive Overview Landing Page
 * 
 * Design: Consistent with main brochure "Editorial Noir" style
 * Purpose: Concise, scannable one-page summary for decision-makers
 * - Brand introduction
 * - Key differentiators
 * - Services at a glance
 * - Fleet overview
 * - Clear CTAs to main website and contact
 */

import { useRef } from "react";
import { IMAGES, LOGO_URL, FLEET } from "@/lib/constants";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield, Clock, Star, Users, Car, Plane, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";

// Fade-in animation wrapper
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Compact Navigation
function OverviewNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <img
            src={LOGO_URL}
            alt="King + Carter Premiere"
            className="h-8 md:h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://www.kingandcarter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-label text-[#f5f0e8]/60 hover:text-[#b8965a] transition-colors hidden sm:inline"
          >
            Visit Website
          </a>
          <Link href="/" className="nav-label text-[#f5f0e8]/60 hover:text-[#b8965a] transition-colors hidden sm:inline">
            Full Brochure
          </Link>
          <a
            href="https://www.kingandcarter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-dark text-[10px] py-2 px-5"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

// Hero — Compact, impactful
function OverviewHero() {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-[#0a0a0a] pt-16">
      <div className="absolute inset-0">
        <img
          src={IMAGES.gridFleetHotel}
          alt="King & Carter fleet at luxury hotel"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <p className="section-label text-[#b8965a] mb-4 tracking-[0.25em]">
            Executive Overview
          </p>
          <h1 className="headline-serif text-[#f5f0e8] text-3xl md:text-5xl lg:text-6xl max-w-3xl leading-[1.1]">
            Premium ground <em>transportation,</em> delivered with <em>intention.</em>
          </h1>
          <p className="body-text text-[#f5f0e8]/60 mt-6 max-w-xl text-base md:text-lg">
            A concise overview of King & Carter Premier — Atlanta's distinguished luxury transport service.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Who We Are — Brief brand intro
function WhoWeAre() {
  return (
    <section className="bg-[#f8f4ed] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeIn>
            <p className="section-label text-[#b8965a] mb-4">Who We Are</p>
            <h2 className="headline-serif text-[#1a1a1a] text-2xl md:text-4xl leading-[1.15] mb-6">
              A brand built on <em>service.</em> Guided by <em>humanity.</em>
            </h2>
            <p className="body-text text-[#1a1a1a]/70 text-base leading-relaxed mb-4">
              King & Carter Premier is a premium transport division built on a simple belief: true luxury is not loud — it is intentional. We approach transportation the same way the world's finest hospitality brands approach service.
            </p>
            <p className="body-text text-[#1a1a1a]/70 text-base leading-relaxed">
              Based in Atlanta, Georgia, we serve private individuals, corporate executives, and organizations who expect consistency, discretion, and an elevated experience at every touchpoint.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="relative">
              <img
                src={IMAGES.escaladePrivate}
                alt="Cadillac Escalade"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#b8965a]" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Key Differentiators — Icon grid
function Differentiators() {
  const items = [
    { icon: Shield, title: "Discretion & Privacy", desc: "Every interaction is handled with the highest level of confidentiality and professionalism." },
    { icon: Clock, title: "Punctuality Guaranteed", desc: "Real-time flight tracking, proactive scheduling, and on-time arrivals — every time." },
    { icon: Star, title: "Hospitality-First", desc: "We don't just drive — we deliver curated experiences rooted in genuine care." },
    { icon: Users, title: "Dedicated Service Team", desc: "A personal point of contact for every client, ensuring seamless coordination." },
  ];

  return (
    <section className="bg-[#1a1a1a] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <FadeIn>
          <p className="section-label text-[#b8965a] mb-4 text-center">Why King & Carter</p>
          <h2 className="headline-serif text-[#f5f0e8] text-2xl md:text-4xl leading-[1.15] text-center mb-16">
            What sets us <em>apart.</em>
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-[#b8965a]/30 rounded-full">
                  <item.icon size={20} className="text-[#b8965a]" />
                </div>
                <h3 className="nav-label text-[#f5f0e8] text-[11px] mb-3">{item.title}</h3>
                <p className="body-text text-[#f5f0e8]/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services At A Glance — Horizontal cards
function ServicesGlance() {
  const services = [
    { icon: Car, title: "Private Luxury Transport", desc: "Bespoke ground transportation for individuals who value comfort and discretion." },
    { icon: Users, title: "Corporate & Executive", desc: "Reliable, professional transport for executives and organizations." },
    { icon: Plane, title: "Airport & Hotel Transfers", desc: "Seamless arrivals and departures with flight tracking and meet-and-greet." },
    { icon: Calendar, title: "Special Events", desc: "Curated transport for galas, weddings, corporate events, and lifestyle engagements." },
  ];

  return (
    <section className="bg-[#f8f4ed] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <FadeIn>
          <p className="section-label text-[#b8965a] mb-4">Our Services</p>
          <h2 className="headline-serif text-[#1a1a1a] text-2xl md:text-4xl leading-[1.15] mb-12">
            Tailored to your <em>needs.</em>
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="flex items-start gap-5 p-6 bg-white/60 border border-[#1a1a1a]/5 hover:border-[#b8965a]/30 transition-colors duration-300">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[#b8965a]/30 rounded-full mt-1">
                  <service.icon size={18} className="text-[#b8965a]" />
                </div>
                <div>
                  <h3 className="nav-label text-[#1a1a1a] text-[11px] mb-2">{service.title}</h3>
                  <p className="body-text text-[#1a1a1a]/60 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Fleet Overview — Compact
function FleetOverview() {
  return (
    <section className="bg-[#0a0a0a] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeIn>
            <div className="relative">
              <img
                src={IMAGES.hero}
                alt="Cadillac Escalade V-Series"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="section-label text-[#b8965a] mb-4">Our Fleet</p>
            <h2 className="headline-serif text-[#f5f0e8] text-2xl md:text-4xl leading-[1.15] mb-8">
              Thoughtfully <em>curated.</em>
            </h2>

            <div className="mb-8">
              <h3 className="nav-label text-[#f5f0e8]/80 text-[11px] mb-3">{FLEET.core.title}</h3>
              <p className="body-text text-[#f5f0e8]/40 text-sm mb-3">{FLEET.core.subtitle}</p>
              <ul className="space-y-2">
                {FLEET.core.vehicles.map((v) => (
                  <li key={v} className="flex items-center gap-3">
                    <ChevronRight size={14} className="text-[#b8965a]" />
                    <span className="body-text text-[#f5f0e8]/70 text-sm">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#f5f0e8]/10 pt-6">
              <h3 className="nav-label text-[#f5f0e8]/80 text-[11px] mb-3">{FLEET.reserve.title}</h3>
              <p className="body-text text-[#f5f0e8]/40 text-sm mb-3">{FLEET.reserve.subtitle}</p>
              <ul className="space-y-2">
                {FLEET.reserve.vehicles.map((v) => (
                  <li key={v} className="flex items-center gap-3">
                    <ChevronRight size={14} className="text-[#b8965a]" />
                    <span className="body-text text-[#f5f0e8]/70 text-sm">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="body-text text-[#f5f0e8]/30 text-xs mt-3 italic">{FLEET.reserve.note}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// CTA Section — Drive to main website and contact
function CTASection() {
  return (
    <section className="bg-[#f8f4ed] py-20 md:py-28">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
        <FadeIn>
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#b8965a]/40 mx-auto mb-8">
            <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
          </svg>
          <h2 className="headline-serif text-[#1a1a1a] text-2xl md:text-4xl leading-[1.15] mb-6">
            Ready to experience <em>intentional</em> luxury?
          </h2>
          <p className="body-text text-[#1a1a1a]/60 text-base mb-10 max-w-lg mx-auto">
            Contact us for fleet details, availability, and custom itineraries. We look forward to serving you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.kingandcarter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-light inline-flex items-center justify-center gap-2"
            >
              Visit Our Website <ArrowRight size={14} />
            </a>
            <Link href="/" className="btn-pill btn-pill-light inline-flex items-center justify-center gap-2">
              View Full Brochure <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-8 space-y-1">
            <p className="body-text text-[#1a1a1a]/50 text-sm">info@kingandcarter.com</p>
            <p className="body-text text-[#1a1a1a]/50 text-sm">+1 (770) 766-0383</p>
            <p className="body-text text-[#1a1a1a]/50 text-sm">Atlanta, Georgia</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Footer
function OverviewFooter() {
  return (
    <footer className="bg-[#0a0a0a] py-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <img
          src={LOGO_URL}
          alt="King + Carter Premiere"
          className="h-8 w-auto"
        />
        <p className="section-label text-[#f5f0e8]/20 text-[10px]">
          King & Carter Premier &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// Main Executive Overview Page
export default function ExecutiveOverview() {
  return (
    <div className="min-h-screen">
      <OverviewNav />
      <OverviewHero />
      <WhoWeAre />
      <Differentiators />
      <ServicesGlance />
      <FleetOverview />
      <CTASection />
      <OverviewFooter />
    </div>
  );
}
