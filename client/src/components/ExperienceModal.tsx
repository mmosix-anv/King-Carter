/*
 * DESIGN: Cinematic Noir experience detail
 * Brochure-page modal: banner image, roman numeral, gold hairlines,
 * itinerary, inclusions, pricing, and twin CTAs.
 */
import { Link } from "wouter";
import { X, Clock, MapPin, Users, Check, Minus, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LINKS, type Experience } from "@/lib/experiences";

interface Props {
  experience: Experience | null;
  onClose: () => void;
}

export default function ExperienceModal({ experience, onClose }: Props) {
  const e = experience;

  return (
    <Dialog open={!!e} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#0A0A0A] max-h-[92dvh] w-[calc(100vw-1.5rem)] overflow-y-auto rounded-none border border-gold/25 p-0 gap-0 shadow-2xl sm:w-full sm:max-w-3xl"
      >
        {e && (
          <>
            {/* Banner */}
            <div className="relative h-56 w-full overflow-hidden sm:h-72">
              <img
                src={e.image}
                alt={e.imageAlt}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/25 bg-[#0A0A0A]/50 text-ivory backdrop-blur-sm transition-colors duration-300 hover:border-gold/50 hover:bg-[#0A0A0A]/80"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-5 left-6 right-6 sm:left-8">
                <p className="section-label mb-2">
                  {e.numeral} · Signature Experience
                </p>
                <DialogTitle className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-medium leading-tight">
                  {e.title}
                </DialogTitle>
              </div>
            </div>

            <div className="px-6 pb-8 pt-7 sm:px-8">
              <DialogDescription className="sr-only">{e.tagline}</DialogDescription>

              {/* Overview */}
              <p className="font-serif text-lg sm:text-xl text-ivory/80 font-light leading-relaxed">
                {e.overview}
              </p>

              {/* Key facts */}
              <div className="mt-7 grid gap-5 border-y border-white/8 py-6 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Clock size={16} className="mt-1 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="section-label !text-[0.62rem]">Duration</p>
                    <p className="mt-1.5 font-serif text-lg text-ivory/85">{e.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="section-label !text-[0.62rem]">Pickup &amp; Return</p>
                    <p className="mt-1.5 text-sm font-light leading-snug text-ivory/55">{e.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={16} className="mt-1 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="section-label !text-[0.62rem]">Guests</p>
                    <p className="mt-1.5 text-sm font-light leading-snug text-ivory/55">{e.guests}</p>
                  </div>
                </div>
              </div>

              {/* Why unique */}
              <div className="mt-8">
                <p className="section-label">Why This Experience Is Unique</p>
                <p className="mt-3 text-ivory/60 font-light leading-relaxed">{e.whyUnique}</p>
              </div>

              {/* Itinerary */}
              <div className="mt-8">
                <p className="section-label">{e.itineraryLabel}</p>
                <ol className="mt-4">
                  {e.itinerary.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-baseline gap-4 border-b border-white/5 py-3 last:border-b-0"
                    >
                      <span className="text-xs font-light tracking-[0.1em] text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.95rem] font-light text-ivory/75">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Included / Not included */}
              <div className="mt-8 grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="section-label">What's Included</p>
                  <ul className="mt-4 space-y-3">
                    {e.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm font-light text-ivory/65"
                      >
                        <Check size={15} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="section-label">Not Included</p>
                  <ul className="mt-4 space-y-3">
                    {e.notIncluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm font-light text-ivory/40"
                      >
                        <Minus size={15} className="mt-0.5 shrink-0 opacity-60" strokeWidth={1.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing + enhancements */}
              <div className="mt-8 border border-gold/20 bg-[#0F0F0F] p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="section-label">Experience Pricing</p>
                  <p className="font-serif text-xl font-light text-gold">{e.investment}</p>
                </div>
                {e.investmentNote && (
                  <p className="mt-2 text-xs font-light leading-relaxed text-ivory/40">
                    {e.investmentNote}
                  </p>
                )}

                <hr className="gold-rule my-5 opacity-30" />

                <p className="section-label flex items-center gap-2">
                  <Sparkles size={13} strokeWidth={1.5} /> Concierge Enhancements
                </p>
                <ul className="mt-4 space-y-2.5">
                  {e.enhancements.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm font-light text-ivory/65"
                    >
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs font-light leading-relaxed text-ivory/35">
                  {e.enhancementNote}
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={LINKS.reserve} className="flex-1">
                  <span className="flex items-center justify-center text-xs tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-4 hover:bg-gold-light transition-colors duration-400 font-medium">
                    Book This Experience
                  </span>
                </Link>
                <Link href={LINKS.concierge} className="flex-1">
                  <span className="flex items-center justify-center text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold px-8 py-4 hover:bg-gold hover:text-[#0A0A0A] transition-all duration-400">
                    Contact Concierge
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
