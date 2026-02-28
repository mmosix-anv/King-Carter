/*
 * DESIGN: Cinematic Noir Experience Coming Soon Page
 * Full-bleed hero with atmospheric background, editorial layout describing
 * upcoming curated experiences with a notify form.
 */
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Wine, Plane, Music } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/events-diverse-VdNwYEZNA9dqJ3nJssANxj.webp";

const upcomingExperiences = [
  {
    icon: Wine,
    title: "Private Dining Journeys",
    description: "Curated evenings at Atlanta's most exclusive restaurants, paired with chauffeured transport and personalized concierge coordination from reservation to return.",
  },
  {
    icon: Plane,
    title: "Weekend Retreats",
    description: "Luxury ground transportation woven into full weekend getaways. From vineyard tours to coastal escapes, every mile is part of the experience.",
  },
  {
    icon: Music,
    title: "Cultural Evenings",
    description: "Premium access to concerts, gallery openings, and theater premieres with coordinated arrivals, VIP handling, and seamless departures.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Celebrations",
    description: "Milestone moments deserve more than a ride. Anniversary surprises, proposal logistics, and birthday experiences designed around your vision.",
  },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Experience() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);

    try {
      // Call Edge Function with anon key for authentication
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/subscribe-newsletter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to subscribe');
      }

      setSubmitted(true);
      toast.success("Thank you! We'll notify you when The Experience launches.");
      setEmail("");
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* Hero */}
      <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />

        <div className="relative h-full container flex flex-col justify-end pb-16 lg:pb-24">
          <FadeUp>
            <p className="section-label mb-3">Coming Soon</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory font-medium leading-tight mb-4">
              The King & Carter<br />
              <span className="font-light text-gold">Experience</span>
            </h1>
            <p className="text-lg text-ivory/60 font-light max-w-lg">
              Beyond transportation. A collection of curated moments designed for those who value intention in every detail.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 lg:py-32">
        <div className="container max-w-3xl">
          <FadeUp>
            <p className="text-lg lg:text-xl text-ivory/70 font-light leading-relaxed mb-8">
              We are building something new. The King & Carter Experience will bring together luxury ground transportation with curated lifestyle moments private dining, cultural events, weekend retreats, and celebrations all coordinated with the same care and discretion you expect from us.
            </p>
            <hr className="gold-rule w-20 opacity-40 mb-8" />
            <p className="text-base text-ivory/50 font-light leading-relaxed">
              Each experience will be designed in partnership with Atlanta's finest venues, chefs, and cultural institutions. Transportation is just the beginning.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Upcoming Experiences Grid */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="container max-w-5xl">
          <FadeUp>
            <p className="section-label mb-4 text-center">What to Expect</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory text-center mb-16 font-medium">
              Curated Moments, <span className="font-light text-gold">Arriving Soon</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {upcomingExperiences.map((exp, i) => (
              <FadeUp key={exp.title} delay={i * 0.1}>
                <div className="p-8 lg:p-10 border border-white/5 hover:border-gold/20 transition-colors duration-500">
                  <exp.icon size={28} className="text-gold mb-5" strokeWidth={1.2} />
                  <h3 className="font-serif text-xl text-ivory mb-3 font-medium">{exp.title}</h3>
                  <p className="text-sm text-ivory/50 font-light leading-relaxed">{exp.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="container text-center max-w-xl">
          <FadeUp>
            <p className="section-label mb-4">Stay Informed</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory mb-6 font-medium">
              Be the First <span className="font-light text-gold">to Know</span>
            </h2>
            <p className="text-ivory/50 font-light leading-relaxed mb-10">
              Leave your email and we will notify you when The Experience launches. Early subscribers will receive priority access and exclusive invitations.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gold font-serif text-lg"
              >
                Thank you. We will be in touch.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent border border-white/10 text-ivory/80 text-sm px-5 py-3.5 focus:border-gold/40 focus:outline-none transition-colors font-light placeholder:text-ivory/20"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-3.5 hover:bg-gold-light transition-all duration-400 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Subscribing...' : 'Notify Me'} <ArrowRight size={14} />
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
