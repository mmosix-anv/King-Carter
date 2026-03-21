/*
 * DESIGN: Cinematic Noir Header
 * Transparent header with King & Carter logo, letter-spaced nav links.
 * Fixed position, blurs on scroll. Services dropdown on hover.
 * Mobile: hamburger with expandable Services sub-menu.
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Service } from "@/lib/supabase";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/king-carter-logo-bright_175fd0e0.png";

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  }, [location]);

  async function loadServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('title, slug')
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setServicesOpen(false), 200);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5"
          : "bg-gradient-to-b from-black/85 via-black/50 to-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20 lg:h-24">
        {/* Logo */}
        <Link href="/">
          <img
            src={LOGO_URL}
            alt="King & Carter"
            className="h-12 lg:h-14 w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          {/* Services Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-xs tracking-[0.15em] xl:tracking-[0.25em] uppercase text-ivory/70 hover:text-gold transition-colors duration-300 font-sans font-normal inline-flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap">
              Services
              <ChevronDown
                size={12}
                className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </span>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-3 w-72 bg-[#0A0A0A]/95 backdrop-blur-lg border border-white/10 shadow-2xl"
                >
                  <div className="py-2">
                    {services.length === 0 ? (
                      <div className="px-6 py-3 text-xs text-ivory/40">No services available</div>
                    ) : (
                      services.map((service) => (
                        <Link key={service.slug} href={`/services/${service.slug}`}>
                          <span className="block px-6 py-3 text-xs tracking-[0.15em] uppercase text-ivory/60 hover:text-gold hover:bg-white/[0.03] transition-all duration-300 font-sans">
                            {service.title}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Nav Links */}
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="text-xs tracking-[0.15em] xl:tracking-[0.25em] uppercase text-ivory/70 hover:text-gold transition-colors duration-300 font-sans font-normal leading-none whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          ))}

          <Link href="/become-a-member">
            <span className="text-xs tracking-[0.15em] xl:tracking-[0.2em] uppercase text-gold/80 hover:text-gold transition-colors duration-300 font-sans font-normal leading-none whitespace-nowrap">
              Become a Member
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/reservations">
              <span className="text-xs tracking-[0.15em] xl:tracking-[0.2em] uppercase border border-gold/40 text-gold px-4 xl:px-6 py-2.5 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400 font-sans font-normal whitespace-nowrap">
                Book an Experience
              </span>
            </Link>

            <span className="text-ivory/25 font-light select-none">|</span>

            <Link href="/login">
              <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-ivory/55 hover:text-ivory/80 transition-colors duration-300 font-sans font-normal">
                <LogIn size={12} strokeWidth={1.5} />
                Login
              </span>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-ivory/80 hover:text-gold transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-white/5"
          >
            <nav className="container py-8 flex flex-col gap-5">
              {/* Services Expandable */}
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-ivory/70 hover:text-gold transition-colors font-sans w-full"
                >
                  Services
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-3 flex flex-col gap-3 border-l border-gold/20 ml-1">
                        {services.length === 0 ? (
                          <span className="text-xs text-ivory/40">No services available</span>
                        ) : (
                          services.map((service) => (
                            <Link key={service.slug} href={`/services/${service.slug}`}>
                              <span className="text-xs tracking-[0.15em] uppercase text-ivory/50 hover:text-gold transition-colors font-sans">
                                {service.title}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Links */}
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-sm tracking-[0.2em] uppercase text-ivory/70 hover:text-gold transition-colors font-sans">
                    {link.label}
                  </span>
                </Link>
              ))}

              <Link href="/become-a-member">
                <span className="text-sm tracking-[0.2em] uppercase text-gold/80 hover:text-gold transition-colors font-sans">
                  Become a Member
                </span>
              </Link>

              <Link href="/reservations">
                <span className="text-sm tracking-[0.2em] uppercase border border-gold/40 text-gold px-6 py-3 hover:bg-gold hover:text-[#0A0A0A] transition-all inline-block text-center font-sans">
                  Book an Experience
                </span>
              </Link>

              <Link href="/login">
                <span className="text-sm tracking-[0.2em] uppercase text-ivory/40 hover:text-ivory/60 transition-colors font-sans inline-flex items-center gap-2">
                  <LogIn size={13} strokeWidth={1.5} />
                  Login
                </span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
