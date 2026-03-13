/**
 * King & Carter Digital Brochure — Home Page
 * 
 * Design: "Editorial Noir" — styled after Quintessentially Experiences page
 * - Libre Caslon Display for headlines (matching Big Caslon FB from Quintessentially)
 * - Libre Caslon Text for body text (matching Adobe Caslon Pro)
 * - Montserrat for navigation and labels
 * - Dark charcoal + warm gold + ivory palette
 * - Full-bleed photo mosaic grid with Atlanta imagery
 * - Pill-style outlined buttons
 * - Generous whitespace between sections
 */

import { useEffect, useRef, useState } from "react";
import { IMAGES, LOGO_URL, SERVICES, TESTIMONIALS } from "@/lib/constants";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

// Fade-in animation wrapper
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Navigation with official logo
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#1a1a1a]/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <a href="#" className="flex items-center">
          <img
            src={LOGO_URL}
            alt="King + Carter Premiere"
            className="h-10 md:h-12 w-auto"
          />
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["Services", "Fleet", "Our Story", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="nav-label text-[#f5f0e8]/70 hover:text-[#b8965a] transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <a
            href="/executive-overview"
            className="nav-label text-[#b8965a]/80 hover:text-[#b8965a] transition-colors duration-300"
          >
            Overview
          </a>
        </div>
        <a
          href=" https://kingandcarter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block px-6 py-2.5 bg-[#b8965a] text-[#0a0a0a] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#d4b87a] transition-colors duration-300"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Book Now
        </a>
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#f5f0e8]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#1a1a1a]/98 backdrop-blur-md px-6 pb-6"
        >
          {["Services", "Fleet", "Our Story", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="block py-3 nav-label text-[#f5f0e8]/70 hover:text-[#b8965a] transition-colors border-b border-[#f5f0e8]/5"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <a
            href="/executive-overview"
            className="block py-3 nav-label text-[#b8965a]/80 hover:text-[#b8965a] transition-colors border-b border-[#f5f0e8]/5"
            onClick={() => setMobileOpen(false)}
          >
            Executive Overview
          </a>
          <a
            href=" https://kingandcarter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-3 nav-label text-[#f5f0e8]/70 hover:text-[#b8965a] transition-colors border-b border-[#f5f0e8]/5"
            onClick={() => setMobileOpen(false)}
          >
            Visit Website ↗
          </a>
          <a
            href=" https://kingandcarter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-6 py-2.5 bg-[#b8965a] text-[#0a0a0a] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#d4b87a] transition-colors duration-300"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => setMobileOpen(false)}
          >
            Book Now
          </a>
        </motion.div>
      )}
    </nav>
  );
}

// Hero Section — Full-screen with cinematic image
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#0a0a0a]">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Luxury black SUV at a grand hotel entrance at dusk"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="section-label text-[#b8965a] mb-6 tracking-[0.25em]">
            King & Carter Premier
          </p>
          <h1 className="headline-serif text-[#f5f0e8] text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.1]">
            Premium service, <em>delivered</em> with <em>intention.</em>
          </h1>
          <p className="body-text text-[#f5f0e8]/70 mt-8 max-w-xl text-lg md:text-xl">
            Private transport experiences shaped by hospitality, discretion, and modern elegance.
          </p>
          <div className="mt-10 flex gap-4 flex-wrap">
            <a href="#services" className="btn-pill btn-pill-dark">
              Explore services
            </a>
            <a
              href=" https://kingandcarter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#b8965a] text-[#0a0a0a] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#d4b87a] transition-colors duration-300"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Now
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#b8965a]/50 to-[#b8965a]" />
      </motion.div>
    </section>
  );
}

// Headline Statement Section — Like Quintessentially's large italic headlines
function StatementSection({
  children,
  cta,
  ctaHref = "#contact",
  dark = false,
}: {
  children: React.ReactNode;
  cta?: string;
  ctaHref?: string;
  dark?: boolean;
}) {
  return (
    <section className={`py-24 md:py-36 ${dark ? "bg-[#1a1a1a]" : "bg-[#f8f4ed]"}`}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <FadeIn>
          <h2
            className={`headline-serif text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.15] ${
              dark ? "text-[#f5f0e8]" : "text-[#1a1a1a]"
            }`}
          >
            {children}
          </h2>
          {cta && (
            <div className="mt-10">
              <a
                href={ctaHref}
                className={`btn-pill ${dark ? "btn-pill-dark" : "btn-pill-light"}`}
              >
                {cta}
              </a>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

// Photo Mosaic Grid — Edge-to-edge with Atlanta imagery
function PhotoGrid() {
  const gridImages = [
    { src: IMAGES.gridAirport, alt: "Airport transfer service" },
    { src: IMAGES.gridFleetHotel, alt: "Fleet lineup at luxury hotel" },
    { src: IMAGES.atlantaSkyline, alt: "Atlanta skyline at twilight" },
    { src: IMAGES.gridInterior, alt: "Luxury vehicle interior" },
    { src: IMAGES.escaladePrivate, alt: "Cadillac Escalade V-Series at luxury hotel" },
    { src: IMAGES.suburbanCity, alt: "Chevrolet Suburban on city street at night" },
  ];

  return (
    <section className="bg-[#0a0a0a]">
      <div className="grid grid-cols-2 md:grid-cols-3">
        {gridImages.map((img, i) => (
          <motion.div
            key={i}
            className="relative aspect-square overflow-hidden group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#b8965a]/0 group-hover:bg-[#b8965a]/10 transition-colors duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Services Grid — 4 columns with background images like Quintessentially
function ServicesSection() {
  return (
    <section id="services" className="bg-[#f8f4ed] py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="relative h-[400px] md:h-[500px] overflow-hidden group">
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3 className="headline-serif text-[#f5f0e8] text-xl md:text-2xl leading-tight mb-4">
                  {service.title}
                </h3>
                <p className="body-text text-[#f5f0e8]/70 text-sm mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <a href="#contact" className="btn-pill btn-pill-dark text-xs self-start">
                  Learn more
                </a>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// Fleet Section
function FleetSection() {
  return (
    <section id="fleet" className="bg-[#1a1a1a] py-24 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <FadeIn>
          <p className="section-label text-[#b8965a] mb-4 tracking-[0.25em]">Our Fleet</p>
          <h2 className="headline-serif text-[#f5f0e8] text-3xl md:text-5xl mb-4">
            Thoughtfully <em>curated.</em> Professionally <em>presented.</em>
          </h2>
          <p className="body-text text-[#f5f0e8]/60 max-w-2xl mt-6 text-lg">
            Our fleet is intentionally selected to support elevated travel experiences rooted in comfort, discretion, and reliability — designed to meet the needs of private individuals, executives, and organizations.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <FadeIn delay={0.1}>
            <div className="border border-[#f5f0e8]/10 p-8 md:p-10">
              <p className="section-label text-[#b8965a] mb-3 tracking-[0.2em]">Core Fleet</p>
              <h3 className="headline-serif text-[#f5f0e8] text-2xl mb-4">
                Modern, black-on-black luxury vehicles
              </h3>
              <div className="space-y-3 mt-6">
                {["Chevrolet Suburban", "Cadillac Escalade", "Executive Sprinter Vans"].map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#b8965a] rounded-full flex-shrink-0" />
                    <span className="body-text text-[#f5f0e8]/70">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="border border-[#b8965a]/30 p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#b8965a]">
                  <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="2" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <p className="section-label text-[#b8965a] mb-3 tracking-[0.2em]">Reserve Collection</p>
              <h3 className="headline-serif text-[#f5f0e8] text-2xl mb-2">
                By Request
              </h3>
              <p className="body-text text-[#f5f0e8]/50 text-sm mb-6">
                Ultra-luxury vehicles for select clients and special engagements
              </p>
              <div className="space-y-3">
                {["Rolls-Royce Cullinan", "Rolls-Royce Ghost", "Mercedes-Maybach"].map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#b8965a] rounded-full flex-shrink-0" />
                    <span className="body-text text-[#f5f0e8]/70">{v}</span>
                  </div>
                ))}
              </div>
              <p className="body-text text-[#f5f0e8]/40 text-sm mt-6 italic">
                Advance notice required. Pricing provided upon request.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section — Dark textured background like Quintessentially
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="relative bg-[#111] py-24 md:py-36 overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-12">
        <FadeIn>
          <p className="section-label text-[#b8965a] mb-8 tracking-[0.25em]">
            What Our Clients Say
          </p>
        </FadeIn>

        <div className="relative min-h-[280px]">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: i === current ? 1 : 0,
                x: i === current ? 0 : i < current ? -40 : 40,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className={`${i === current ? "relative" : "absolute inset-0"} ${
                i !== current ? "pointer-events-none" : ""
              }`}
            >
              <p className="section-label text-[#b8965a]/60 mb-6">{t.category}</p>
              <blockquote className="headline-serif text-[#f5f0e8] text-xl md:text-3xl italic leading-relaxed">
                "{t.quote}"
              </blockquote>
              <p className="body-text text-[#f5f0e8]/50 mt-8 text-base">
                <strong className="text-[#b8965a] font-medium not-italic">{t.attribution}</strong>
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-12">
          <button
            onClick={prev}
            className="w-10 h-10 border border-[#f5f0e8]/20 rounded-full flex items-center justify-center text-[#f5f0e8]/60 hover:border-[#b8965a] hover:text-[#b8965a] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 border border-[#f5f0e8]/20 rounded-full flex items-center justify-center text-[#f5f0e8]/60 hover:border-[#b8965a] hover:text-[#b8965a] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <span className="section-label text-[#f5f0e8]/30 ml-4">
            {String(current + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

// Brand Story Section
function BrandStorySection() {
  return (
    <section id="our-story" className="bg-[#f8f4ed] py-24 md:py-36">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <FadeIn>
          <p className="section-label text-[#b8965a] mb-6 tracking-[0.25em]">Our Story</p>
        </FadeIn>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-3">
            <FadeIn>
              <h2 className="headline-serif text-[#1a1a1a] text-3xl md:text-4xl mb-8">
                A brand built on <em>service.</em> Guided by <em>humanity.</em> Driven by <em>excellence.</em>
              </h2>
              <div className="space-y-6">
                <p className="body-text text-[#1a1a1a]/70 text-lg">
                  King & Carter Premier is a premium transport division built on a simple belief: true luxury is not loud — it is intentional. We approach transportation the same way the world's finest hospitality brands approach service: with care, consistency, and attention to detail.
                </p>
                <p className="body-text text-[#1a1a1a]/70 text-lg">
                  King & Carter stands at the intersection of luxury and service, experience and responsibility, success and significance. We operate with compassion. We move with purpose.
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="md:col-span-2">
            <FadeIn delay={0.2}>
              <div className="border-l-2 border-[#b8965a]/30 pl-8 space-y-10">
                <div>
                  <blockquote className="headline-serif text-[#1a1a1a] text-lg italic leading-relaxed">
                    "Whatever your life's work is, do it well."
                  </blockquote>
                  <p className="section-label text-[#b8965a] mt-3">Dr. Martin Luther King Jr.</p>
                </div>
                <div>
                  <blockquote className="headline-serif text-[#1a1a1a] text-lg italic leading-relaxed">
                    "Everybody can be great... because anybody can serve."
                  </blockquote>
                  <p className="section-label text-[#b8965a] mt-3">Dr. Martin Luther King Jr.</p>
                </div>
                <div>
                  <blockquote className="headline-serif text-[#1a1a1a] text-lg italic leading-relaxed">
                    "To be true to ourselves, we must be true to others."
                  </blockquote>
                  <p className="section-label text-[#b8965a] mt-3">JIMMY Carter</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="bg-[#1a1a1a] py-24 md:py-36">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <FadeIn>
              <p className="section-label text-[#b8965a] mb-6 tracking-[0.25em]">Contact Us</p>
              <h2 className="headline-serif text-[#f5f0e8] text-3xl md:text-4xl mb-8">
                Begin your <em>elevated</em> experience.
              </h2>
              <p className="body-text text-[#f5f0e8]/60 text-lg mb-12">
                Fleet details, availability, and custom itineraries provided upon request.
              </p>

              <div className="space-y-6">
                <a
                  href="mailto:info@kingandcarter.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-[#b8965a]/30 rounded-full flex items-center justify-center group-hover:border-[#b8965a] transition-colors">
                    <Mail size={16} className="text-[#b8965a]" />
                  </div>
                  <span className="body-text text-[#f5f0e8]/70 group-hover:text-[#b8965a] transition-colors">
                    info@kingandcarter.com
                  </span>
                </a>
                <a
                  href="tel:+17707660383"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-[#b8965a]/30 rounded-full flex items-center justify-center group-hover:border-[#b8965a] transition-colors">
                    <Phone size={16} className="text-[#b8965a]" />
                  </div>
                  <span className="body-text text-[#f5f0e8]/70 group-hover:text-[#b8965a] transition-colors">
                    +1 (770) 766-0383
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#b8965a]/30 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-[#b8965a]" />
                  </div>
                  <span className="body-text text-[#f5f0e8]/70">
                    Atlanta, Georgia
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#b8965a]/30 rounded-full flex items-center justify-center">
                    <Clock size={16} className="text-[#b8965a]" />
                  </div>
                  <span className="body-text text-[#f5f0e8]/70">
                    Available by appointment
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for your enquiry. Our team will be in touch shortly.");
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name *"
                  required
                  className="bg-transparent border-b border-[#f5f0e8]/20 text-[#f5f0e8] body-text py-3 px-0 focus:border-[#b8965a] focus:outline-none transition-colors placeholder:text-[#f5f0e8]/30"
                />
                <input
                  type="text"
                  placeholder="Last name *"
                  required
                  className="bg-transparent border-b border-[#f5f0e8]/20 text-[#f5f0e8] body-text py-3 px-0 focus:border-[#b8965a] focus:outline-none transition-colors placeholder:text-[#f5f0e8]/30"
                />
              </div>
              <input
                type="email"
                placeholder="Email address *"
                required
                className="w-full bg-transparent border-b border-[#f5f0e8]/20 text-[#f5f0e8] body-text py-3 px-0 focus:border-[#b8965a] focus:outline-none transition-colors placeholder:text-[#f5f0e8]/30"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full bg-transparent border-b border-[#f5f0e8]/20 text-[#f5f0e8] body-text py-3 px-0 focus:border-[#b8965a] focus:outline-none transition-colors placeholder:text-[#f5f0e8]/30"
              />
              <select
                className="w-full bg-transparent border-b border-[#f5f0e8]/20 text-[#f5f0e8]/30 body-text py-3 px-0 focus:border-[#b8965a] focus:outline-none transition-colors appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Service of interest</option>
                <option value="private" className="bg-[#1a1a1a] text-[#f5f0e8]">Private Luxury Transport</option>
                <option value="corporate" className="bg-[#1a1a1a] text-[#f5f0e8]">Corporate & Executive Travel</option>
                <option value="airport" className="bg-[#1a1a1a] text-[#f5f0e8]">Airport & Hotel Transfers</option>
                <option value="events" className="bg-[#1a1a1a] text-[#f5f0e8]">Special Events & Lifestyle</option>
                <option value="reserve" className="bg-[#1a1a1a] text-[#f5f0e8]">Reserve Collection</option>
              </select>
              <textarea
                placeholder="How can we help? *"
                required
                rows={4}
                className="w-full bg-transparent border-b border-[#f5f0e8]/20 text-[#f5f0e8] body-text py-3 px-0 focus:border-[#b8965a] focus:outline-none transition-colors placeholder:text-[#f5f0e8]/30 resize-none"
              />
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-pill btn-pill-dark"
                >
                  Submit
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Footer with official logo
function Footer() {
  return (
    <footer className="bg-[#0a0a0a] py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Gold cross divider */}
        <div className="flex justify-center mb-12">
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#b8965a]/30">
            <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <img
              src={LOGO_URL}
              alt="King + Carter Premiere"
              className="h-10 w-auto mx-auto md:mx-0"
            />
            <p className="body-text text-[#f5f0e8]/40 mt-3 text-sm">
              Premium service, delivered with intention.
            </p>
          </div>

          <div>
            <p className="section-label text-[#b8965a] mb-4">Services</p>
            <div className="space-y-2">
              {["Private Luxury Transport", "Corporate & Executive Travel", "Airport & Hotel Transfers", "Special Events & Lifestyle"].map(
                (s) => (
                  <p key={s} className="body-text text-[#f5f0e8]/40 text-sm hover:text-[#b8965a] transition-colors cursor-pointer">
                    {s}
                  </p>
                )
              )}
            </div>
          </div>

          <div>
            <p className="section-label text-[#b8965a] mb-4">Connect</p>
            <div className="space-y-2">
              <p className="body-text text-[#f5f0e8]/40 text-sm">info@kingandcarter.com</p>
              <p className="body-text text-[#f5f0e8]/40 text-sm">+1 (770) 766-0383</p>
              <p className="body-text text-[#f5f0e8]/40 text-sm">Atlanta, Georgia</p>
              <a
                href=" https://kingandcarter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="body-text text-[#b8965a]/60 hover:text-[#b8965a] text-sm transition-colors inline-block mt-2"
              >
                www.kingandcarter.com ↗
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#f5f0e8]/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="section-label text-[#f5f0e8]/20 text-[10px]">
            King & Carter Premier &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="section-label text-[#f5f0e8]/20 text-[10px] hover:text-[#b8965a] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="section-label text-[#f5f0e8]/20 text-[10px] hover:text-[#b8965a] transition-colors cursor-pointer">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Home Page
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />

      {/* Statement 1 — Like Quintessentially's "Creators of luxury events and experiences" */}
      <StatementSection cta="Explore services" ctaHref="#services">
        Providers of premium <em>ground transportation</em> that is{" "}
        <em>intentional.</em>
      </StatementSection>

      {/* Photo Mosaic Grid */}
      <PhotoGrid />

      {/* Statement 2 */}
      <StatementSection cta="Get in touch" dark>
        We deliver <em>lasting impressions</em> through{" "}
        <em>hospitality,</em> discretion, and modern elegance.
      </StatementSection>

      {/* Services Grid */}
      <ServicesSection />

      {/* Statement 3 */}
      <StatementSection cta="Let's get started">
        We are champions of <em>excellence</em> in the service of{" "}
        <em>intention.</em>
      </StatementSection>

      {/* Fleet Section */}
      <FleetSection />

      {/* Brand Story */}
      <BrandStorySection />

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
