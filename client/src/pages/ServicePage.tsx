/*
 * DESIGN: Cinematic Noir Service Pages
 * Each service gets a unique cinematic hero image.
 * Full-bleed hero, service highlights with gold accents, CTA.
 */
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, Service } from "@/lib/supabase";

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

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [otherServices, setOtherServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    window.scrollTo(0, 0);
    if (slug) {
      loadService(slug);
    }
  }, [slug]);

  async function loadService(serviceSlug: string) {
    try {
      // Load current service
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('slug', serviceSlug)
        .eq('status', 'published')
        .single();

      if (serviceError) throw serviceError;
      setService(serviceData);

      // Load other services
      const { data: othersData, error: othersError } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .neq('slug', serviceSlug)
        .order('display_order', { ascending: true })
        .limit(3);

      if (othersError) throw othersError;
      setOtherServices(othersData || []);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p className="text-ivory/50">Loading...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="font-serif text-4xl text-ivory mb-4">Service Not Found</h1>
          <Link href="/">
            <span className="text-gold hover:text-gold-light transition-colors">Return Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.hero_image || '/placeholder.jpg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/20" />

        <div className="relative h-full container flex flex-col justify-end pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-3">Services</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory font-medium leading-tight mb-4">
              {service.title}
            </h1>
            <p className="text-lg text-ivory/60 font-light font-serif">{service.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* ===== DESCRIPTION ===== */}
      <section className="py-24 lg:py-32">
        <div className="container max-w-4xl">
          <FadeUp>
            {service.description && service.description.length > 0 && (
              <div className="space-y-6 mb-8">
                {service.description.map((para, i) => (
                  <p key={i} className="text-lg lg:text-xl text-ivory/70 font-light leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            )}
            <hr className="gold-rule w-20 opacity-40" />
          </FadeUp>
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      {service.highlights && service.highlights.length > 0 && (
        <section className="py-24 lg:py-32 bg-[#080808]">
          <div className="container max-w-4xl">
            <FadeUp>
              <p className="section-label mb-4">Service Highlights</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory mb-12 font-medium">
                What to <span className="font-light text-gold">Expect</span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.highlights.map((highlight, i) => (
                <FadeUp key={i} delay={i * 0.06}>
                  <div className="flex items-start gap-4 p-5 border border-white/5 hover:border-gold/15 transition-colors duration-400">
                    <Check size={18} className="text-gold mt-0.5 shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-ivory/70 font-light">{highlight}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== OTHER SERVICES ===== */}
      {otherServices.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="container">
            <FadeUp>
              <p className="section-label mb-4 text-center">Explore More</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory text-center mb-12 font-medium">
                Other <span className="font-light text-gold">Services</span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherServices.map((s, i) => (
                <FadeUp key={s.slug} delay={i * 0.1}>
                  <Link href={`/services/${s.slug}`}>
                    <div className="group relative overflow-hidden aspect-[16/10] cursor-pointer">
                      <img
                        src={s.hero_image || '/placeholder.jpg'}
                        alt={s.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-serif text-lg text-ivory mb-1 font-medium">{s.title}</h3>
                        <span className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                          Learn More <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="py-24 lg:py-32 bg-[#080808]">
        <div className="container text-center">
          <FadeUp>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory mb-6 font-medium">
              {service.cta?.text || "Ready to Get Started?"}
            </h2>
            <p className="text-ivory/50 font-light max-w-md mx-auto mb-10">
              Contact us to discuss your requirements and let us craft the perfect experience.
            </p>
            <Link href={service.cta?.buttonUrl || "/reservations"}>
              <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-10 py-4 hover:bg-gold-light transition-all duration-400 font-medium">
                {service.cta?.buttonLabel || "Book Now"}
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
