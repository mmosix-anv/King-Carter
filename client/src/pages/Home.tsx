/*
 * DESIGN: Cinematic Noir — Homepage
 * Full-bleed hero with cinematic hotel arrival image.
 * 4-card services grid with unique imagery per service.
 * Dark palette, gold accents, Playfair Display headings, Inter body.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Clock, Users, Star, Gem } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, Service } from "@/lib/supabase";

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/hero-escalade-5okQMximnwKcV6cV3SJq9Q.webp",
  fleet: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/fleet-escalade-crnVmWMFtCKEbCWw4UKNdP.webp",
};

const whyReasons = [
  { icon: Clock, title: "Professional Experience", text: "From booking to arrival, every detail is coordinated." },
  { icon: Shield, title: "Discreet & Reliable", text: "Professionally presented drivers who understand discretion." },
  { icon: Gem, title: "Modern Fleet", text: "Clean, luxury vehicles designed for comfort." },
  { icon: Users, title: "Personalized Service", text: "Coordination tailored to every engagement." },
  { icon: Star, title: "Service, Not Spectacle", text: "A brand rooted in intention, not excess." },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    window.scrollTo(0, 0);
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />

        <div className="relative h-full container flex flex-col justify-end pb-24 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <p className="section-label mb-4">King & Carter Premier</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-medium text-ivory leading-[1.1] mb-6">
              Premium Service,<br />
              <span className="font-light text-gold">Delivered with Intention</span>
            </h1>
            <p className="text-base lg:text-lg text-ivory/60 font-light leading-relaxed max-w-lg mb-10">
              Private transport experiences shaped by hospitality, discretion, and modern elegance.
            </p>
            <Link href="/contact">
              <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase border border-gold/50 text-gold px-8 py-4 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400 group">
                Book an Experience
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown size={20} className="text-ivory/30 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="py-28 lg:py-40">
        <div className="container">
          <FadeUp>
            <p className="section-label mb-4 text-center">Our Services</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory text-center mb-4 font-medium">
              Curated for Every Occasion
            </h2>
            <p className="text-ivory/50 text-center font-light max-w-xl mx-auto mb-16 lg:mb-20">
              From executive travel to special celebrations, each service is designed with the same commitment to excellence.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-ivory/50">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-ivory/50">No services available</p>
              </div>
            ) : (
              services.map((service, i) => (
                <FadeUp key={service.slug} delay={i * 0.1}>
                  <Link href={`/services/${service.slug}`}>
                    <div className="group relative overflow-hidden aspect-[16/10] cursor-pointer">
                      <img
                        src={service.hero_image || '/placeholder.jpg'}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                        <h3 className="font-serif text-xl lg:text-2xl text-ivory mb-2 font-medium">
                          {service.title}
                        </h3>
                        <p className="text-sm text-ivory/50 font-light mb-4 max-w-sm">
                          {service.tagline}
                        </p>
                        <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                          Learn More <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== FLEET PREVIEW ===== */}
      <section className="py-28 lg:py-40 bg-[#080808]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeUp>
              <p className="section-label mb-4">Our Fleet</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mb-6 font-medium">
                Modern Luxury,<br />
                <span className="font-light text-gold">Impeccably Presented</span>
              </h2>
              <p className="text-ivory/50 font-light leading-relaxed mb-8 max-w-md">
                Each vehicle in our fleet is selected for comfort, discretion, and performance. Professionally maintained and presented to reflect our standards — because the details matter.
              </p>
              <hr className="gold-rule w-24 mb-8 opacity-40" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-serif text-3xl text-gold mb-1">100%</p>
                  <p className="text-xs text-ivory/40 tracking-wide uppercase">Luxury Fleet</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-gold mb-1">24/7</p>
                  <p className="text-xs text-ivory/40 tracking-wide uppercase">Availability</p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={IMAGES.fleet}
                  alt="Luxury fleet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#080808]/30" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== WHO WE ARE ===== */}
      <section className="py-28 lg:py-40">
        <div className="container text-center max-w-3xl mx-auto">
          <FadeUp>
            <p className="section-label mb-4">Who We Are</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mb-8 font-medium leading-tight">
              True Luxury Is Not Loud,<br />
              <span className="font-light text-gold">It Is Intentional</span>
            </h2>
            <p className="text-ivory/50 font-light leading-relaxed text-lg mb-10">
              King & Carter Premier is built on a simple belief: that premium service should be felt, not announced. Inspired by the finest hospitality standards, we focus on calm, carefully coordinated experiences rather than excess. Every journey is designed to feel seamless, personal, and refined.
            </p>
            <Link href="/about">
              <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-300 group">
                Learn More About Us
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ===== WHY KING & CARTER ===== */}
      <section className="py-28 lg:py-40 bg-[#080808]">
        <div className="container">
          <FadeUp>
            <p className="section-label mb-4 text-center">Why King & Carter</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory text-center mb-16 lg:mb-20 font-medium">
              Premium Is Felt <span className="font-light text-gold">in the Details</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {whyReasons.map((reason, i) => (
              <FadeUp key={reason.title} delay={i * 0.08}>
                <div className="text-center p-6 lg:p-4 border border-white/5 hover:border-gold/20 transition-colors duration-400">
                  <reason.icon size={24} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="font-serif text-base text-ivory mb-2">{reason.title}</h4>
                  <p className="text-xs text-ivory/40 font-light leading-relaxed">{reason.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${IMAGES.events})` }} />
        <div className="absolute inset-0 bg-[#0A0A0A]/80" />
        <div className="relative container text-center">
          <FadeUp>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mb-6 font-medium">
              Ready to Experience <span className="font-light text-gold">the Difference?</span>
            </h2>
            <p className="text-ivory/50 font-light max-w-lg mx-auto mb-10">
              Let us coordinate your next journey with the care and attention it deserves.
            </p>
            <Link href="/contact">
              <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-10 py-4 hover:bg-gold-light transition-all duration-400 font-medium">
                Book Now
                <ArrowRight size={16} />
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
