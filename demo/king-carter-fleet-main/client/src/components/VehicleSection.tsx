/*
 * VehicleSection — Luxury experience presentation
 * Single hero image, minimal specs, experience-focused description,
 * subtle "Reserve" CTA. Alternating layout (image left/right) for visual rhythm.
 * Typography: Playfair Display headings, Inter body.
 * Colors: near-black bg, gold (#cba960) accents, warm off-white text.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Vehicle } from "@/lib/vehicleData";
import { Users, Briefcase, ArrowRight } from "lucide-react";

interface VehicleSectionProps {
  vehicle: Vehicle;
  index: number;
}

export default function VehicleSection({ vehicle, index }: VehicleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const isReversed = index % 2 !== 0;

  return (
    <section
      ref={sectionRef}
      id={vehicle.id}
      className="relative scroll-mt-20"
    >
      {/* Full-width layout container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-36">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center ${
            isReversed ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* ─── IMAGE COLUMN ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:[direction:ltr]"
          >
            <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle bottom gradient for blending */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* ─── CONTENT COLUMN ─── */}
          <div className="lg:col-span-5 lg:[direction:ltr]">
            {/* Category */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gold text-[11px] tracking-[3px] uppercase mb-4"
            >
              {vehicle.category}
            </motion.p>

            {/* Vehicle name */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-2xl sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15] font-medium text-warm-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {vehicle.name}
            </motion.h2>

            {/* Thin gold rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-12 bg-gold origin-left mb-6"
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-warm-white-60 text-[15px] leading-[1.8] mb-8"
            >
              {vehicle.description}
            </motion.p>

            {/* Specs — minimal: passengers + luggage */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-10 mb-8"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-[14px] h-[14px] text-gold" />
                <span className="text-warm-white text-sm">
                  {vehicle.passengers} Passengers
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-[14px] h-[14px] text-gold" />
                <span className="text-warm-white text-sm">
                  {vehicle.luggage} Luggage
                </span>
              </div>
            </motion.div>

            {/* Amenities — concise dot-separated line */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-10 pb-8 border-b border-warm-white/8"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {vehicle.amenities.map((amenity, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && (
                      <span className="text-gold/40 text-[10px]">&middot;</span>
                    )}
                    <span className="text-warm-white-40 text-[13px]">
                      {amenity}
                    </span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="https://www.kingandcarter.com"
                className="inline-flex items-center gap-3 text-gold text-[12px] tracking-[2px] uppercase group"
              >
                <span className="relative">
                  Reserve
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section divider — subtle gold line */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>
    </section>
  );
}
