import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleSection from "@/components/VehicleSection";
import { supabase, FleetVehicle } from "@/lib/supabase";
import { fleetHeroImage } from "@/lib/vehicleData";

const shortNames: Record<string, string> = {
  suburban: "Suburban",
  escalade: "Escalade",
  maybach: "Maybach",
  sprinter: "Sprinter",
  ghost: "Ghost",
  cullinan: "Cullinan",
};

export default function Fleet() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.06]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadVehicles();
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function loadVehicles() {
    try {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error loading fleet:', error);
    }
  }

  useEffect(() => {
    if (!vehicles.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveVehicle(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    vehicles.forEach((v) => {
      const el = document.getElementById(v.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [vehicles]);

  const scrollToVehicle = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* Vehicle quick-nav — desktop only, sits below the main header */}
      <div className={`hidden xl:flex fixed top-20 lg:top-24 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#0A0A0A]/90 backdrop-blur-md border-t border-white/5" : "bg-transparent border-t border-white/10"
      }`}>
        <div className="container flex items-center justify-center gap-8 h-10">
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => scrollToVehicle(v.id)}
              className={`relative text-[11px] tracking-[2px] uppercase transition-colors duration-300 whitespace-nowrap ${
                activeVehicle === v.id ? "text-gold" : "text-ivory/50 hover:text-ivory"
              }`}
            >
              {shortNames[v.id] || v.name}
              {activeVehicle === v.id && (
                <motion.div
                  layoutId="fleet-nav-indicator"
                  className="absolute -bottom-[1px] left-0 right-0 h-px bg-gold"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div ref={heroRef} className="relative h-[90vh] sm:h-screen overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          <img src={fleetHeroImage} alt="King & Carter luxury fleet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-[#0A0A0A]/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 h-full container flex flex-col justify-end pb-24 lg:pb-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="section-label mb-5"
          >
            Our Fleet
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl sm:text-5xl lg:text-7xl font-medium text-ivory leading-[1.08] mb-6"
          >
            Every Detail,
            <br />
            <span className="font-light text-gold">Intentional</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-ivory/75 text-base sm:text-lg max-w-lg leading-relaxed font-light"
          >
            A curated collection of vehicles selected for comfort, discretion, and presence. Professionally maintained to reflect our standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-14"
          >
            <button
              onClick={() => scrollToVehicle(vehicles[0].id)}
              className="flex items-center gap-2 text-ivory/50 hover:text-gold transition-colors duration-300 group"
            >
              <span className="text-[11px] tracking-[2px] uppercase">Explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Vehicle sections */}
      <main className="xl:pt-10">
        {vehicles.map((vehicle, index) => (
          <VehicleSection key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </main>

      {/* CTA */}
      <section className="py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#080808] to-[#0A0A0A]" />
        <div className="relative container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-6 text-center">Begin Your Experience</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-ivory mb-6 leading-[1.15]">
              Ready to Experience
              <br />
              <span className="font-light text-gold">the Difference?</span>
            </h2>
            <p className="text-ivory/75 text-base sm:text-lg mb-12 leading-relaxed font-light max-w-lg mx-auto">
              Let us coordinate your next journey with the care and attention it deserves.
            </p>
            <Link href="/reservations">
              <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase border border-gold/40 text-gold px-8 py-4 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400">
                Book an Experience
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
