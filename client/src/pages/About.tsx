/*
 * DESIGN: Cinematic Noir — About Us
 * Editorial layout with Atlanta skyline hero, lifestyle image grid,
 * founder's letter section, and brand values. Playfair Display headings, Inter body.
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/about-hero-RrEuk8KkLKLswuWpc4Xskf.webp",
  dining: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/about-lifestyle-Mwu3V8DSQWUVvDCe4yddwb.webp",
  yacht: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/about-yacht-VjPD6vL98XyeCBb6msCLgq.webp",
  theater: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/about-theater-4NnDMXxyD6xyWmab7CUMrX.webp",
  corporate: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/corporate-diverse-kQ7gozJJ5PSGzT9Q99VYbQ.webp",
};

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

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/20" />

        <div className="relative h-full container flex flex-col justify-end pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-3">About Us</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory font-medium leading-tight">
              Built on Service,<br />
              <span className="font-light text-gold">Rooted in Atlanta</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ===== EDITORIAL INTRO ===== */}
      <section className="py-24 lg:py-36">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left column — large text */}
            <div className="lg:col-span-5">
              <FadeUp>
                <p className="section-label mb-6">Our Story</p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium leading-snug">
                  Premium service should be felt,{" "}
                  <span className="font-light text-gold">not announced.</span>
                </h2>
              </FadeUp>
            </div>

            {/* Right column — body text */}
            <div className="lg:col-span-7">
              <FadeUp delay={0.15}>
                <p className="text-ivory/60 font-light leading-relaxed text-base lg:text-lg mb-6">
                  King & Carter Premier was founded with a clear vision: to bring the standards of the finest hospitality to private ground transportation. Based in Atlanta, we serve discerning clients who expect more than just a ride — they expect an experience that reflects their values and lifestyle.
                </p>
                <p className="text-ivory/60 font-light leading-relaxed text-base lg:text-lg mb-6">
                  Our approach is shaped by the principles of luxury hospitality — anticipation, discretion, and attention to detail. Every vehicle is meticulously prepared. Every chauffeur is professionally trained. Every journey is coordinated with the kind of care that turns transportation into a seamless extension of your day.
                </p>
                <p className="text-ivory/60 font-light leading-relaxed text-base lg:text-lg">
                  We don't believe luxury needs to be loud. We believe it should be intentional, consistent, and quietly exceptional. That's the King & Carter standard.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIFESTYLE GRID ===== */}
      <section className="py-4 lg:py-6">
        <div className="container">
          <FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={IMAGES.dining} alt="Fine dining" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={IMAGES.theater} alt="Grand venue" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={IMAGES.yacht} alt="Luxury yacht" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={IMAGES.corporate} alt="Executive travel" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== FOUNDER'S LETTER ===== */}
      <section className="py-24 lg:py-36 bg-[#080808]">
        <div className="container max-w-3xl">
          <FadeUp>
            <p className="section-label mb-6 text-center">A Letter from Our Founder</p>
            <hr className="gold-rule w-16 mx-auto mb-10 opacity-40" />
            <blockquote className="font-serif text-xl lg:text-2xl text-ivory/80 leading-relaxed text-center italic mb-8">
              "I started King & Carter because I believed Atlanta deserved a transportation brand that matched the city's ambition. Not louder — just better. More thoughtful. More intentional. Every detail, from the vehicle to the greeting, should communicate one thing: we care about your experience."
            </blockquote>
            <p className="text-center">
              <span className="text-gold font-serif text-lg">— Karton Zawolo</span>
              <br />
              <span className="text-ivory/40 text-sm font-light">Founder</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== BRAND VALUES ===== */}
      <section className="py-24 lg:py-36">
        <div className="container">
          <FadeUp>
            <p className="section-label mb-4 text-center">Our Values</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory text-center mb-16 font-medium">
              The Principles That <span className="font-light text-gold">Guide Us</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {[
              { title: "Hospitality First", text: "We approach every engagement as hosts, not vendors. Your comfort and experience are our primary concern." },
              { title: "Quiet Excellence", text: "We don't need to announce our standards — they speak through every interaction, every vehicle, every journey." },
              { title: "Intentional Detail", text: "From the temperature of the cabin to the timing of the arrival, nothing is left to chance." },
            ].map((value, i) => (
              <FadeUp key={value.title} delay={i * 0.1}>
                <div className="text-center">
                  <hr className="gold-rule w-10 mx-auto mb-6 opacity-40" />
                  <h3 className="font-serif text-xl text-ivory mb-3 font-medium">{value.title}</h3>
                  <p className="text-sm text-ivory/50 font-light leading-relaxed">{value.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 lg:py-32 bg-[#080808]">
        <div className="container text-center">
          <FadeUp>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory mb-6 font-medium">
              Experience the <span className="font-light text-gold">King & Carter Difference</span>
            </h2>
            <p className="text-ivory/50 font-light max-w-md mx-auto mb-10">
              Discover what premium ground transportation feels like when it's built on hospitality.
            </p>
            <Link href="/contact">
              <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-10 py-4 hover:bg-gold-light transition-all duration-400 font-medium">
                Get in Touch
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
