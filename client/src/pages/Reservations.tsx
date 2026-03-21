/*
 * King & Carter — Reservations Page
 * Based on demo/king-carter-book-now-main BookNow design.
 */

import { useEffect, useRef, useState } from "react";
import { Clock, Shield, Car, UserCheck, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/FQyr2jPsM9DJhTd6unvn3k/hero-arrival-9qjK2eBkbYp58sszKHazKh.webp";
const BRAND_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/FQyr2jPsM9DJhTd6unvn3k/rear-cabin-interior-mjAtp7Kd9qeFNN3WpZDkiY.webp";

const TRUST_FEATURES = [
  { icon: Clock, title: "Seamless Coordination", desc: "From booking to arrival, every detail is handled with precision." },
  { icon: Shield, title: "Discreet & Reliable", desc: "Professionally presented drivers who understand discretion." },
  { icon: Car, title: "Modern Luxury Fleet", desc: "Clean, luxury vehicles selected for comfort and performance." },
  { icon: UserCheck, title: "Personalized Service", desc: "Every journey coordinated to your specific needs." },
  { icon: Sparkles, title: "Service, Not Spectacle", desc: "A brand rooted in intention, not excess." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Reservations() {
  const brandSection = useInView(0.2);
  const formSection = useInView(0.1);
  const trustSection = useInView(0.15);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Load iframeResizer and init once the script is ready
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js";
    script.async = true;
    script.onload = () => {
      if (iframeRef.current && (window as any).iFrameResize) {
        (window as any).iFrameResize(
          { log: false, checkOrigin: false, scrolling: false, heightCalculationMethod: "lowestElement" },
          iframeRef.current
        );
      }
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Header />

      {/* HERO */}
      <section className="relative h-[90vh] min-h-[650px] flex items-end overflow-hidden">
        <div className="absolute inset-0 animate-slow-zoom">
          <img src={HERO_IMG} alt="Luxury vehicle arriving at a grand hotel entrance" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.95) 100%)" }} />

        <div className="relative z-10 container pb-16 lg:pb-24">
          <p className="section-label mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            Book Your Ride
          </p>
          <h1 className="heading-display text-[40px] sm:text-5xl md:text-[64px] lg:text-[72px] max-w-3xl leading-[1.1] opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            Reserve Your <span className="text-gold-accent">Experience</span>
          </h1>
          <p className="mt-5 lg:mt-6 text-base lg:text-lg max-w-xl leading-relaxed opacity-0 animate-fade-in-up" style={{ color: "rgba(245,241,234,0.6)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300, animationDelay: "700ms", animationFillMode: "forwards" }}>
            Premium ground transportation coordinated with the care and attention your journey deserves.
          </p>
          <div className="mt-10 lg:mt-14 opacity-0 animate-fade-in" style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}>
            <a href="#book" className="flex items-center gap-3 group transition-all duration-300 w-fit">
              <span className="text-xs tracking-[0.2em] uppercase transition-colors duration-300 group-hover:text-gold" style={{ color: "rgba(245,241,234,0.4)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 400 }}>Scroll to Book</span>
              <span className="w-8 h-px transition-all duration-300 group-hover:w-12" style={{ backgroundColor: "rgba(203,169,96,0.5)" }} />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-y-0.5" style={{ color: "rgba(203,169,96,0.5)" }}>
                <path d="M6 1L6 11M6 11L1 6M6 11L11 6" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section ref={brandSection.ref} className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: "#080808" }}>
        <div className="absolute inset-0 opacity-[0.22]">
          <img src={BRAND_IMG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="relative z-10 container text-center max-w-3xl mx-auto">
          <div className={`gold-divider mx-auto mb-10 transition-all duration-1000 ease-out ${brandSection.inView ? "w-24 opacity-100" : "w-0 opacity-0"}`} />
          <p className={`section-label mb-6 transition-all duration-700 ease-out ${brandSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "200ms" }}>
            King & Carter Premier
          </p>
          <h2 className={`heading-display text-2xl sm:text-3xl lg:text-4xl mb-6 transition-all duration-700 ease-out ${brandSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "400ms" }}>
            True Luxury Is Not Loud, <span className="text-gold-accent">It Is Intentional</span>
          </h2>
          <p className={`text-base lg:text-lg leading-relaxed max-w-2xl mx-auto transition-all duration-700 ease-out ${brandSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ color: "rgba(245,241,234,0.55)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300, transitionDelay: "600ms" }}>
            Every journey with King & Carter is designed to feel seamless, personal, and refined. Complete your reservation below and let us coordinate your next experience with the discretion and care it deserves.
          </p>
          <div className={`gold-divider mx-auto mt-10 transition-all duration-1000 ease-out ${brandSection.inView ? "w-24 opacity-100" : "w-0 opacity-0"}`} style={{ transitionDelay: "800ms" }} />
        </div>
      </section>

      {/* BOOKING WIDGET */}
      <section id="book" ref={formSection.ref} className="py-16 lg:py-24" style={{ backgroundColor: "#060606" }}>
        <div className="container">
          <div className={`text-center mb-10 lg:mb-14 transition-all duration-700 ease-out ${formSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="section-label mb-4">Complete Your Reservation</p>
            <h2 className="heading-display text-2xl sm:text-3xl lg:text-4xl">
              Book <span className="text-gold-accent">Your Ride</span>
            </h2>
          </div>

          <div className={`max-w-7xl mx-auto transition-all duration-900 ease-out ${formSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms", backgroundColor: "#060606" }}>
            <iframe
              ref={iframeRef}
              src="/booking"
              title="King & Carter Online Reservations"
              scrolling="no"
              allowtransparency="true"
              style={{
                border: "none",
                width: "1px",
                minWidth: "100%",
                display: "block",
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
            />
          </div>

          <div className={`text-center mt-10 lg:mt-14 transition-all duration-700 ease-out ${formSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "600ms" }}>
            <p className="text-sm" style={{ color: "rgba(245,241,234,0.35)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300 }}>
              Prefer to speak with us directly?{" "}
              <a href="/contact" className="transition-colors duration-300 hover:text-gold" style={{ color: "rgba(203,169,96,0.7)" }}>Contact our team</a>
            </p>
          </div>
        </div>
      </section>

      {/* TRUST FEATURES */}
      <section ref={trustSection.ref} className="py-20 lg:py-28" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="container">
          <div className={`text-center mb-12 lg:mb-16 transition-all duration-700 ease-out ${trustSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="section-label mb-4">Why King & Carter</p>
            <h2 className="heading-display text-2xl sm:text-3xl lg:text-4xl">
              Premium Is Felt <span className="text-gold-accent">in the Details</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 max-w-6xl mx-auto">
            {TRUST_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className={`text-center p-6 lg:p-5 border transition-all duration-700 ease-out hover:border-gold/30 ${trustSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ borderColor: "rgba(255,255,255,0.06)", transitionDelay: `${200 + i * 100}ms` }}>
                  <Icon className="w-6 h-6 mx-auto mb-4" strokeWidth={1} style={{ color: "rgba(203,169,96,0.6)" }} />
                  <h4 className="text-sm mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500, color: "rgba(245,241,234,0.85)" }}>{feature.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(245,241,234,0.4)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300 }}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-36" style={{ backgroundColor: "#060606" }}>
        <div className="container text-center">
          <div className="gold-divider mx-auto w-16 mb-10" />
          <h2 className="heading-display text-2xl sm:text-3xl lg:text-[42px] mb-5">
            Ready to Experience <span className="text-gold-accent">the Difference?</span>
          </h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(245,241,234,0.5)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300 }}>
            Let us coordinate your next journey with the care and attention it deserves.
          </p>
          <a href="#book" className="inline-flex items-center gap-3 px-8 py-4 text-[13px] tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-90" style={{ backgroundColor: "rgb(203,169,96)", color: "rgb(10,10,10)", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 400 }}>
            Book Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
