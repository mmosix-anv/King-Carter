/*
 * FleetPage — King & Carter Fleet Experience
 * Design: Luxury experience presentation — not a vehicle catalog.
 * Single hero image per vehicle, minimal specs, experience-focused copy.
 * Playfair Display headings, Inter body, gold accents, near-black bg.
 */

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import VehicleSection from "@/components/VehicleSection";
import { vehicles, heroImage, logoUrl } from "@/lib/vehicleData";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";

export default function FleetPage() {
  const [activeVehicle, setActiveVehicle] = useState<string>("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.06]);

  // Track active vehicle on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVehicle(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    vehicles.forEach((v) => {
      const el = document.getElementById(v.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Header background on scroll
  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToVehicle = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileNavOpen(false);
    }
  };

  const shortNames: Record<string, string> = {
    suburban: "Suburban",
    escalade: "Escalade",
    maybach: "Maybach",
    sprinter: "Sprinter",
    ghost: "Ghost",
    cullinan: "Cullinan",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── HEADER ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          headerSolid
            ? "bg-background/90 backdrop-blur-xl border-b border-warm-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="https://www.kingandcarter.com" className="flex items-center group">
            <img
              src={logoUrl}
              alt="King & Carter Premiere"
              className="h-8 lg:h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-8">
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => scrollToVehicle(v.id)}
                className={`relative text-[11px] tracking-[2px] uppercase transition-colors duration-300 whitespace-nowrap ${
                  activeVehicle === v.id
                    ? "text-gold"
                    : "text-warm-white-40 hover:text-warm-white"
                }`}
              >
                {shortNames[v.id] || v.name}
                {activeVehicle === v.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.kingandcarter.com"
              className="hidden sm:flex items-center gap-2 px-5 py-2 border border-gold/30 text-gold text-[11px] tracking-[2px] uppercase hover:bg-gold/8 hover:border-gold/60 transition-all duration-300"
            >
              Book Now
              <ArrowRight className="w-3 h-3" />
            </a>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="xl:hidden text-warm-white p-1"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden overflow-hidden border-t border-warm-white/5 bg-background/95 backdrop-blur-xl"
            >
              <div className="px-6 py-5 space-y-1">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => scrollToVehicle(v.id)}
                    className={`block w-full text-left px-3 py-2.5 text-[11px] tracking-[2px] uppercase transition-colors ${
                      activeVehicle === v.id ? "text-gold" : "text-warm-white-40"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
                <div className="pt-3 mt-2 border-t border-warm-white/5">
                  <a
                    href="https://www.kingandcarter.com"
                    className="block w-full text-left px-3 py-2.5 text-[11px] tracking-[2px] uppercase text-gold"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO ─── */}
      <div ref={heroRef} className="relative h-[90vh] sm:h-screen overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt="King & Carter luxury fleet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-28 lg:pb-36 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gold text-[11px] tracking-[4px] uppercase mb-5"
          >
            Our Fleet
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-warm-white leading-[1.08] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Every Detail,
            <br />
            <span className="text-gold">Intentional</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-warm-white-60 text-base sm:text-lg max-w-lg leading-relaxed"
          >
            A curated collection of vehicles selected for comfort, discretion,
            and presence. Professionally maintained to reflect our standards.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-14"
          >
            <button
              onClick={() => scrollToVehicle(vehicles[0].id)}
              className="flex items-center gap-2 text-warm-white-40 hover:text-gold transition-colors duration-300 group"
            >
              <span className="text-[11px] tracking-[2px] uppercase">
                Explore
              </span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ─── VEHICLE SECTIONS ─── */}
      <main>
        {vehicles.map((vehicle, index) => (
          <VehicleSection key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </main>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-28 sm:py-36 lg:py-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-dark-surface/50 to-background" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold text-[11px] tracking-[4px] uppercase mb-6"
          >
            Begin Your Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-medium text-warm-white mb-6 leading-[1.15]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready to Experience
            <br />
            <span className="text-gold">the Difference?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-warm-white-60 text-base sm:text-lg mb-12 leading-relaxed"
          >
            Let us coordinate your next journey with the care
            and attention it deserves.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="https://www.kingandcarter.com"
              className="inline-flex items-center gap-3 px-8 py-3.5 border border-gold/40 text-gold text-[12px] tracking-[2px] uppercase hover:bg-gold/8 hover:border-gold/70 transition-all duration-300"
            >
              Book an Experience
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-warm-white/5 py-14 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Brand */}
            <div>
              <img
                src={logoUrl}
                alt="King & Carter Premiere"
                className="h-8 w-auto mb-4 opacity-80"
              />
              <p className="text-warm-white-40 text-sm leading-relaxed mb-3">
                Premium ground transportation shaped by
                <br />
                hospitality, discretion, and modern elegance.
              </p>
              <p className="text-warm-white-40 text-sm">
                Atlanta, Georgia
                <br />
                info@kingandcarter.com
              </p>
            </div>

            {/* Fleet links */}
            <div>
              <p className="text-[11px] tracking-[3px] uppercase text-gold mb-5">
                Our Fleet
              </p>
              <div className="space-y-3">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => scrollToVehicle(v.id)}
                    className="block text-warm-white-40 text-sm hover:text-warm-white transition-colors duration-300"
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Company links */}
            <div>
              <p className="text-[11px] tracking-[3px] uppercase text-gold mb-5">
                Company
              </p>
              <div className="space-y-3">
                {["About Us", "Services", "Experience", "Become a Member", "Contact"].map(
                  (link) => (
                    <a
                      key={link}
                      href="https://www.kingandcarter.com"
                      className="block text-warm-white-40 text-sm hover:text-warm-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-warm-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-warm-white-40 text-xs">
              &copy; {new Date().getFullYear()} King & Carter Premier. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://www.kingandcarter.com"
                className="text-warm-white-40 text-xs hover:text-warm-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.kingandcarter.com"
                className="text-warm-white-40 text-xs hover:text-warm-white transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
