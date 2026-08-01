/*
 * DESIGN: Cinematic Noir Curated Atlanta Experiences
 * Full-bleed chauffeur hero, editorial "curated moments" chapter, four signature
 * experiences with brochure-style detail modals, bespoke journeys, the King & Carter
 * difference, how it works, and booking with the Digital Experience Guide.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Car,
  UserRound,
  ConciergeBell,
  Route,
  DoorOpen,
  GlassWater,
  Plane,
  Briefcase,
  Star,
  Landmark,
  Utensils,
  Building2,
  Compass,
  Hotel,
  Eye,
  Share2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExperienceModal from "@/components/ExperienceModal";
import {
  ASSETS,
  LINKS,
  experiences,
  bespokeIdeas,
  type Experience as ExperienceItem,
} from "@/lib/experiences";
import { toast } from "sonner";

const HIGHLIGHT_ICONS = [
  { icon: Car, label: "Luxury SUV" },
  { icon: UserRound, label: "Professional Chauffeur" },
  { icon: ConciergeBell, label: "Concierge Assistance" },
  { icon: Compass, label: "Curated Itinerary" },
  { icon: Utensils, label: "Restaurant Reservations" },
  { icon: Landmark, label: "Museum Coordination" },
  { icon: Building2, label: "Local Insights" },
  { icon: Hotel, label: "Pickup Service" },
];

const WHY_ITEMS = [
  { icon: Car, label: "Luxury Transportation", desc: "A pristine luxury SUV, prepared for every journey." },
  { icon: UserRound, label: "Professional Chauffeurs", desc: "Discreet, attentive, and impeccably trained." },
  { icon: ConciergeBell, label: "Concierge-Level Service", desc: "Reservations, timings, and details handled." },
  { icon: Route, label: "Flexible Itineraries", desc: "Every journey shaped around your pace and taste." },
  { icon: DoorOpen, label: "Complimentary Pickup", desc: "From your preferred location within the Atlanta service area." },
  { icon: GlassWater, label: "Complimentary Bottled Water", desc: "Small comforts, always anticipated." },
  { icon: Plane, label: "Flight Monitoring", desc: "We track your arrival so you never wait." },
  { icon: Briefcase, label: "Corporate & Leisure", desc: "Composed for executives, couples, and families alike." },
  { icon: Star, label: "Personalized Recommendations", desc: "Local insight from people who love this city." },
];

const STEPS = [
  {
    num: "I",
    title: "Choose an Experience",
    desc: "Select a signature journey, or ask our concierge to compose one entirely your own.",
  },
  {
    num: "II",
    title: "Customize Your Journey",
    desc: "We tailor the itinerary, reservations, and timing to your party, pace, and preferences.",
  },
  {
    num: "III",
    title: "Ride with King & Carter",
    desc: "Your chauffeur arrives at your door. From that moment, every detail is attended to.",
  },
  {
    num: "IV",
    title: "Enjoy a Curated Atlanta",
    desc: "Culture, history, art, and cuisine, experienced as the city was meant to be seen.",
  },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Experience() {
  const [selected, setSelected] = useState<ExperienceItem | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleShare = async () => {
    const shareData = {
      title: "King & Carter — Curated Atlanta Experiences",
      text: "Discover Atlanta through culture, history, art, and cuisine with King & Carter.",
      url: LINKS.brochureSite,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(LINKS.brochureSite);
        toast.success("Experience Guide link copied to your clipboard");
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

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
          body: JSON.stringify({
            email,
            source: 'experience_page'
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to subscribe');
      }

      setSubmitted(true);
      toast.success("Thank you. We will share new experiences as they are released.");
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

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <img
          src={ASSETS.hero}
          alt="A King & Carter chauffeur opening the door of a black luxury SUV against the dusk Atlanta skyline"
          className="absolute inset-0 h-full w-full object-cover object-[45%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />

        <div className="relative container pb-16 pt-40 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-3">Private · Chauffeured · Curated</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory font-medium leading-tight mb-5 max-w-3xl">
              Curated Atlanta{" "}
              <span className="font-light text-gold">Experiences</span>
            </h1>
            <p className="text-lg lg:text-xl text-ivory/60 font-light max-w-xl leading-relaxed">
              Experience Atlanta through culture, history, art, cuisine, and exceptional hospitality.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <a href="#experiences">
                <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-4 hover:bg-gold-light transition-all duration-400 font-medium">
                  Explore the Experiences
                </span>
              </a>
              <Link href={LINKS.concierge}>
                <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm tracking-[0.2em] uppercase border border-gold/50 text-gold px-8 py-4 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400">
                  Speak with a Concierge
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CURATED MOMENTS ===== */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7">
              <FadeUp>
                <p className="section-label mb-4">Curated Moments</p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium leading-snug">
                  More Than <span className="font-light text-gold">Transportation</span>
                </h2>
                <hr className="gold-rule w-20 opacity-40 my-7" />
                <p className="text-base lg:text-lg text-ivory/60 font-light leading-relaxed mb-5">
                  King & Carter creates private, chauffeured experiences for travelers, executives, couples, families, and small groups who wish to discover Atlanta in a more meaningful way. Every journey is thoughtfully curated and personally attended, so you may simply arrive, unwind, and experience the city as it was meant to be seen.
                </p>
                <p className="text-base text-ivory/45 font-light leading-relaxed">
                  Each experience is designed in partnership with Atlanta's finest venues, chefs, and cultural institutions. Transportation is just the beginning.
                </p>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-7">
                  {HIGHLIGHT_ICONS.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40">
                        <Icon size={18} className="text-gold" strokeWidth={1.3} />
                      </span>
                      <span className="text-[0.65rem] tracking-[0.16em] uppercase leading-snug text-ivory/50">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-5">
              <FadeUp delay={0.1}>
                <figure className="relative">
                  <div className="absolute -left-4 -top-4 h-full w-full border border-gold/30" aria-hidden />
                  <img
                    src={ASSETS.interior}
                    alt="A couple in the rear cabin of a King & Carter SUV as the Atlanta skyline passes at sunset"
                    className="relative aspect-[4/5] w-full object-cover"
                  />
                </figure>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIGNATURE EXPERIENCES ===== */}
      <section id="experiences" className="py-20 lg:py-28 border-t border-white/5 bg-[#080808] scroll-mt-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <p className="section-label mb-4">The Collection</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium mb-5">
                Signature <span className="font-light text-gold">Experiences</span>
              </h2>
              <p className="text-ivory/50 font-light leading-relaxed">
                Four journeys through the soul of Atlanta, each privately chauffeured, personally attended, and composed to be explored at your own pace. Select an experience to view the full itinerary.
              </p>
            </FadeUp>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {experiences.map((exp, i) => (
              <FadeUp key={exp.id} delay={i * 0.08}>
                <button
                  onClick={() => setSelected(exp)}
                  aria-label={`Learn more about ${exp.title}`}
                  className="group relative block w-full text-left overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <p className="section-label !text-[0.65rem] mb-2">
                        {exp.numeral} · Signature Experience
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl text-ivory font-medium">
                        {exp.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm text-ivory/60 font-light leading-relaxed">
                        {exp.tagline}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.24em] uppercase text-gold transition-all duration-300 group-hover:gap-3.5">
                        Learn More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </button>
              </FadeUp>
            ))}
          </div>

          {/* Bespoke journeys */}
          <FadeUp>
            <div className="mt-14 border border-gold/20 p-8 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                <div className="lg:col-span-5">
                  <p className="section-label !text-[0.65rem] mb-3">No. V · Composed for You</p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-ivory font-medium">
                    Bespoke Journeys
                  </h3>
                  <p className="mt-4 text-ivory/50 font-light leading-relaxed">
                    Beyond our signature collection, our concierge composes one-of-a-kind itineraries around your occasion.
                  </p>
                  <Link href={LINKS.concierge}>
                    <span className="mt-7 inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold px-8 py-3.5 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400">
                      Request a Private Itinerary <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-7">
                  {bespokeIdeas.map((b) => (
                    <div key={b.title} className="border-t border-gold/30 pt-5">
                      <h4 className="font-serif text-lg text-ivory">{b.title}</h4>
                      <p className="mt-2.5 text-sm text-ivory/45 font-light leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== WHY KING & CARTER ===== */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <p className="section-label mb-4">Why Choose King &amp; Carter</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium mb-5">
                An Elevated Atlanta <span className="font-light text-gold">Experience</span>
              </h2>
              <p className="text-ivory/50 font-light leading-relaxed">
                Luxury transportation is where we begin. Hospitality, storytelling, Atlanta culture, and local partnerships are how we set every journey apart.
              </p>
            </FadeUp>
          </div>

          <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {WHY_ITEMS.map(({ icon: Icon, label, desc }, i) => (
              <FadeUp key={label} delay={(i % 3) * 0.08}>
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40">
                    <Icon size={20} className="text-gold" strokeWidth={1.2} />
                  </span>
                  <h3 className="mt-4 text-[0.7rem] tracking-[0.22em] uppercase text-ivory/85">
                    {label}
                  </h3>
                  <p className="mt-2.5 max-w-[16rem] text-sm text-ivory/45 font-light leading-relaxed">
                    {desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <hr className="gold-rule max-w-lg mx-auto mt-16 opacity-40" />
            <blockquote className="mt-10 max-w-2xl mx-auto text-center">
              <p className="font-serif text-xl lg:text-2xl text-ivory/80 font-light leading-relaxed">
                "Hospitality is present when something happens for you. It is absent when something happens to you."
              </p>
              <footer className="section-label !text-[0.62rem] mt-5">— Danny Meyer</footer>
            </blockquote>
          </FadeUp>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 lg:py-32 border-t border-white/5 bg-[#080808]">
        <div className="container">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="section-label mb-4">How It Works</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium leading-snug">
                Effortless, from First Call to{" "}
                <span className="font-light text-gold">Final Mile</span>
              </h2>
            </div>
          </FadeUp>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {STEPS.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.08}>
                <div className="border-t border-gold/30 pt-6">
                  <span className="font-serif text-4xl font-light text-gold">{s.num}</span>
                  <h3 className="mt-3 font-serif text-xl text-ivory">{s.title}</h3>
                  <p className="mt-3 text-sm text-ivory/45 font-light leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="mt-14 flex flex-col sm:flex-row gap-4">
              <Link href={LINKS.reserve}>
                <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-4 hover:bg-gold-light transition-all duration-400 font-medium">
                  Reserve Your Experience <ArrowRight size={16} />
                </span>
              </Link>
              <Link href={LINKS.concierge}>
                <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm tracking-[0.2em] uppercase border border-gold/50 text-gold px-8 py-4 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400">
                  Customize Your Journey
                </span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== BEGIN YOUR JOURNEY ===== */}
      <section className="relative overflow-hidden border-t border-white/5">
        <img
          src={ASSETS.rooftop}
          alt="Guests toasting on a rooftop terrace overlooking the Atlanta skyline at dusk"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/88" />

        <div className="relative container py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
            <div className="lg:col-span-7">
              <FadeUp>
                <p className="section-label mb-4">Book Your Experience</p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium mb-6">
                  Begin Your <span className="font-light text-gold">Journey</span>
                </h2>
                <p className="font-serif text-lg lg:text-xl text-ivory/70 font-light leading-relaxed max-w-lg">
                  Your chauffeur awaits. Reserve your curated Atlanta experience today, and let every detail be attended to on your behalf.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-4">
                  <Link href={LINKS.reserve}>
                    <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-4 hover:bg-gold-light transition-all duration-400 font-medium">
                      Reserve Your Experience <ArrowRight size={16} />
                    </span>
                  </Link>
                  <Link href={LINKS.concierge}>
                    <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm tracking-[0.2em] uppercase border border-gold/50 text-gold px-8 py-4 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400">
                      Speak with a Concierge
                    </span>
                  </Link>
                </div>
                <div className="mt-10 space-y-2.5 text-sm font-light text-ivory/60">
                  <p>
                    <span className="section-label !text-[0.6rem] mr-3">Email</span>
                    <a href={LINKS.email} className="hover:text-gold transition-colors duration-300">
                      info@kingandcarter.com
                    </a>
                  </p>
                  <p>
                    <span className="section-label !text-[0.6rem] mr-3">Web</span>
                    <a href="https://www.kingandcarter.com" className="hover:text-gold transition-colors duration-300">
                      www.kingandcarter.com
                    </a>
                  </p>
                </div>
              </FadeUp>
            </div>

            {/* Digital Experience Guide */}
            <div className="lg:col-span-5">
              <FadeUp delay={0.15}>
                <div className="border border-gold/25 bg-[#0A0A0A]/70 backdrop-blur-md p-8 sm:p-10">
                  <p className="section-label">The Digital Experience Guide</p>
                  <div className="mt-6 flex items-start gap-6">
                    <img
                      src={ASSETS.qr}
                      alt="QR code linking to the King & Carter digital Experience Guide"
                      className="h-28 w-28 shrink-0 border border-gold/40 bg-white p-1.5 sm:h-32 sm:w-32"
                    />
                    <p className="text-sm text-ivory/55 font-light leading-relaxed">
                      Scan to view or share the complete guide, a beautifully composed companion to everything on this page.
                    </p>
                  </div>

                  <hr className="gold-rule my-7 opacity-30" />

                  <div className="flex flex-col gap-4">
                    <a
                      href={LINKS.brochureSite}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-[0.7rem] tracking-[0.22em] uppercase text-ivory/80 hover:text-gold transition-colors duration-300"
                    >
                      <Eye size={16} className="text-gold" strokeWidth={1.4} /> View the Digital Guide
                    </a>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-3 text-left text-[0.7rem] tracking-[0.22em] uppercase text-ivory/80 hover:text-gold transition-colors duration-300"
                    >
                      <Share2 size={16} className="text-gold" strokeWidth={1.4} /> Share the Guide
                    </button>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STAY INFORMED ===== */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="container text-center max-w-xl">
          <FadeUp>
            <p className="section-label mb-4">Stay Informed</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-ivory mb-5 font-medium">
              New Experiences, <span className="font-light text-gold">First</span>
            </h2>
            <p className="text-ivory/50 font-light leading-relaxed mb-10">
              Leave your email and we will share new experiences, seasonal itineraries, and exclusive invitations as they are released.
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

      <ExperienceModal experience={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
