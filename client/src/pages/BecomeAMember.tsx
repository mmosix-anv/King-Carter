/*
 * DESIGN: Cinematic Noir Become a Member Coming Soon Page
 * Editorial layout with membership tier previews, benefits, and notify form.
 */
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Crown, Shield, Gem, Clock, Star, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/fleet-escalade-crnVmWMFtCKEbCWw4UKNdP.webp";

const membershipTiers = [
  {
    icon: Shield,
    name: "Premier",
    tagline: "For the Discerning Traveler",
    benefits: [
      "Priority booking and scheduling",
      "Dedicated account coordinator",
      "Preferred vehicle selection",
      "Complimentary wait time (up to 30 min)",
    ],
  },
  {
    icon: Crown,
    name: "Elite",
    tagline: "For Those Who Expect More",
    benefits: [
      "Everything in Premier",
      "Guaranteed vehicle availability",
      "Personalized vehicle amenities",
      "Access to curated Experience events",
    ],
  },
  {
    icon: Gem,
    name: "Private Circle",
    tagline: "By Invitation Only",
    benefits: [
      "Everything in Elite",
      "24/7 personal concierge line",
      "Custom fleet arrangements",
      "Exclusive lifestyle partnerships",
    ],
  },
];

const memberBenefits = [
  { icon: Clock, title: "Priority Access", text: "Members are always first. Guaranteed availability, even during peak demand." },
  { icon: Star, title: "Personalized Service", text: "Your preferences remembered. Vehicle temperature, music, refreshments every detail." },
  { icon: Users, title: "Dedicated Team", text: "A personal coordinator who knows your schedule, your routes, and your standards." },
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

export default function BecomeAMember() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />

        <div className="relative h-full container flex flex-col justify-end pb-16 lg:pb-24">
          <FadeUp>
            <p className="section-label mb-3">Membership</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory font-medium leading-tight mb-4">
              Become a <span className="font-light text-gold">Member</span>
            </h1>
            <p className="text-lg text-ivory/60 font-light max-w-lg">
              A membership program built around consistency, personalization, and access. Launching soon.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 lg:py-32">
        <div className="container max-w-3xl">
          <FadeUp>
            <p className="text-lg lg:text-xl text-ivory/70 font-light leading-relaxed mb-8">
              King & Carter Membership is designed for clients who value consistency above all else. Rather than booking individual trips, members enjoy a dedicated relationship a team that knows your preferences, anticipates your needs, and ensures every journey reflects your standards.
            </p>
            <hr className="gold-rule w-20 opacity-40 mb-8" />
            <p className="text-base text-ivory/50 font-light leading-relaxed">
              Membership details, pricing, and enrollment will be announced soon. Below is a preview of what we are building.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="container max-w-5xl">
          <FadeUp>
            <p className="section-label mb-4 text-center">Membership Tiers</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory text-center mb-16 font-medium">
              Three Levels of <span className="font-light text-gold">Commitment</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {membershipTiers.map((tier, i) => (
              <FadeUp key={tier.name} delay={i * 0.1}>
                <div className={`p-8 lg:p-10 border transition-colors duration-500 h-full ${
                  i === 2 ? "border-gold/30 bg-gold/[0.03]" : "border-white/5 hover:border-gold/20"
                }`}>
                  <tier.icon size={28} className="text-gold mb-5" strokeWidth={1.2} />
                  <h3 className="font-serif text-2xl text-ivory mb-1 font-medium">{tier.name}</h3>
                  <p className="text-xs text-gold/70 tracking-wide uppercase mb-6">{tier.tagline}</p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                        <span className="text-sm text-ivory/50 font-light">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Member Benefits */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="container max-w-4xl">
          <FadeUp>
            <p className="section-label mb-4 text-center">Why Membership</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory text-center mb-16 font-medium">
              Built Around <span className="font-light text-gold">You</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {memberBenefits.map((benefit, i) => (
              <FadeUp key={benefit.title} delay={i * 0.1}>
                <div className="text-center">
                  <benefit.icon size={24} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-serif text-lg text-ivory mb-2 font-medium">{benefit.title}</h3>
                  <p className="text-sm text-ivory/50 font-light leading-relaxed">{benefit.text}</p>
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
            <p className="section-label mb-4">Join the Waitlist</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory mb-6 font-medium">
              Be Among the <span className="font-light text-gold">First</span>
            </h2>
            <p className="text-ivory/50 font-light leading-relaxed mb-10">
              Membership enrollment opens soon. Leave your email for early access, priority enrollment, and founding member benefits.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gold font-serif text-lg"
              >
                Thank you. You are on the list.
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
                  className="text-xs tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-3.5 hover:bg-gold-light transition-all duration-400 font-medium flex items-center justify-center gap-2"
                >
                  Join Waitlist <ArrowRight size={14} />
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
