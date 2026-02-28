/*
 * DESIGN: Cinematic Noir Contact Page
 * Atmospheric lounge background with frosted-glass form overlay.
 * Split layout: contact info left, form right. Gold accents throughout.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const IMAGES = {
  bg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/contact-concierge-LparVqG2GsRJcjhJjau9GV.webp",
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

const contactInfo = [
  { icon: MapPin, label: "Location", value: "Atlanta, Georgia", detail: "Serving the greater Atlanta metropolitan area" },
  { icon: Phone, label: "Phone", value: "(770) 766-0383", detail: "Available for calls and text inquiries" },
  { icon: Mail, label: "Email", value: "info@kingandcarter.com", detail: "We respond within 24 hours" },
  { icon: Clock, label: "Availability", value: "24/7 Service", detail: "Advance booking recommended" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Call Edge Function with anon key for authentication
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast.success("Thank you for your inquiry. We'll be in touch shortly.");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Failed to send message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.bg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />

        <div className="relative h-full container flex flex-col justify-end pb-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-3">Contact</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-ivory font-medium leading-tight">
              Let's Begin <span className="font-light text-gold">Your Experience</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="py-24 lg:py-36">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Left Contact Info */}
            <div className="lg:col-span-5">
              <FadeUp>
                <h2 className="font-serif text-2xl lg:text-3xl text-ivory mb-4 font-medium">
                  Get in <span className="font-light text-gold">Touch</span>
                </h2>
                <p className="text-ivory/50 font-light leading-relaxed mb-10">
                  Whether you have a specific date in mind or simply want to learn more about our services, we're here to help. Reach out and we'll respond promptly.
                </p>
              </FadeUp>

              <div className="space-y-6">
                {contactInfo.map((item, i) => (
                  <FadeUp key={item.label} delay={i * 0.08}>
                    <div className="flex items-start gap-4 p-5 border border-white/5 hover:border-gold/15 transition-colors duration-400">
                      <item.icon size={20} className="text-gold mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-ivory/40 tracking-wide uppercase mb-1">{item.label}</p>
                        <p className="text-ivory/80 font-light text-sm">{item.value}</p>
                        <p className="text-ivory/40 font-light text-xs mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
              <FadeUp delay={0.15}>
                <div className="bg-[#0F0F0F] border border-white/5 p-8 lg:p-12">
                  <h3 className="font-serif text-xl text-ivory mb-2 font-medium">Book an Experience</h3>
                  <p className="text-ivory/40 font-light text-sm mb-8">
                    Fill in the details below and we'll be in touch to coordinate your journey.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-ivory/40 tracking-wide uppercase block mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-transparent border border-white/10 text-ivory/80 text-sm px-4 py-3 focus:border-gold/40 focus:outline-none transition-colors font-light placeholder:text-ivory/20"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-ivory/40 tracking-wide uppercase block mb-2">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-transparent border border-white/10 text-ivory/80 text-sm px-4 py-3 focus:border-gold/40 focus:outline-none transition-colors font-light placeholder:text-ivory/20"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-ivory/40 tracking-wide uppercase block mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-transparent border border-white/10 text-ivory/80 text-sm px-4 py-3 focus:border-gold/40 focus:outline-none transition-colors font-light placeholder:text-ivory/20"
                          placeholder="(770) 766-0383"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-ivory/40 tracking-wide uppercase block mb-2">Service Interest</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-transparent border border-white/10 text-ivory/80 text-sm px-4 py-3 focus:border-gold/40 focus:outline-none transition-colors font-light appearance-none"
                        >
                          <option value="" className="bg-[#0F0F0F]">Select a service</option>
                          <option value="airport" className="bg-[#0F0F0F]">Airport & Hotel Transfers</option>
                          <option value="corporate" className="bg-[#0F0F0F]">Corporate & Executive Travel</option>
                          <option value="events" className="bg-[#0F0F0F]">Special Engagements & Events</option>
                          <option value="private" className="bg-[#0F0F0F]">Private Luxury Transport</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-ivory/40 tracking-wide uppercase block mb-2">Message</label>
                      <textarea
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-transparent border border-white/10 text-ivory/80 text-sm px-4 py-3 focus:border-gold/40 focus:outline-none transition-colors font-light resize-none placeholder:text-ivory/20"
                        placeholder="Tell us about your upcoming journey or event..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full text-sm tracking-[0.2em] uppercase bg-gold text-[#0A0A0A] px-8 py-4 hover:bg-gold-light transition-all duration-400 font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </form>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAP / AREA ===== */}
      <section className="py-20 lg:py-28 bg-[#080808]">
        <div className="container text-center max-w-2xl">
          <FadeUp>
            <p className="section-label mb-4">Service Area</p>
            <h2 className="font-serif text-2xl lg:text-3xl text-ivory mb-4 font-medium">
              Based in <span className="font-light text-gold">Atlanta</span>
            </h2>
            <p className="text-ivory/50 font-light leading-relaxed">
              King & Carter Premier serves the greater Atlanta metropolitan area, including Hartsfield-Jackson International Airport, Buckhead, Midtown, Downtown, and surrounding communities. Extended travel arrangements are available upon request.
            </p>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
