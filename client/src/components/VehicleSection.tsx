import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FleetVehicle } from "@/lib/supabase";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface VehicleSectionProps {
  vehicle: FleetVehicle;
  index: number;
}

export default function VehicleSection({ vehicle, index }: VehicleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const isReversed = index % 2 !== 0;

  return (
    <section ref={sectionRef} id={vehicle.id} className="relative scroll-mt-20">
      <div className="container py-20 sm:py-28 lg:py-36">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center ${isReversed ? "lg:[direction:rtl]" : ""}`}>

          {/* Image */}
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
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0A0A0A]/30 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-5 lg:[direction:ltr]">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="section-label mb-4"
            >
              {vehicle.category}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-serif text-2xl sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15] font-medium text-ivory mb-6"
            >
              {vehicle.name}
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-12 bg-gold origin-left mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-ivory/75 text-[15px] leading-[1.8] mb-8 font-light"
            >
              {vehicle.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-10 mb-8"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-[14px] h-[14px] text-gold" />
                <span className="text-ivory text-sm">{vehicle.passengers} Passengers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-[14px] h-[14px] text-gold" />
                <span className="text-ivory text-sm">{vehicle.luggage} Luggage</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-10 pb-8 border-b border-white/8"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {vehicle.amenities.map((amenity, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gold/40 text-[10px]">&middot;</span>}
                    <span className="text-ivory/65 text-[13px]">{amenity}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/reservations">
                <span className="inline-flex items-center gap-3 text-gold text-[12px] tracking-[2px] uppercase group cursor-pointer">
                  <span className="relative">
                    Reserve
                    <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>
    </section>
  );
}
