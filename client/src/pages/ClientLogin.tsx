/*
 * DESIGN: Cinematic Noir Client Login
 * Matches the root app's dark luxury aesthetic.
 * Centered card layout with LimoAnywhere login widget embedded.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BG_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/contact-concierge-LparVqG2GsRJcjhJjau9GV.webp";

export default function ClientLogin() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const existing = document.querySelector('script[src="https://book.mylimobiz.com/v4/widgets/widget-loader.js"]');
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://book.mylimobiz.com/v4/widgets/widget-loader.js";
    script.async = true;
    document.body.appendChild(script);

    return () => { script.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000]">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-[#000000]/30" />

        <div className="relative h-full container flex flex-col justify-end pb-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-3">Client Portal</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory font-medium leading-tight">
              Welcome <span className="font-light text-gold">Back.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ===== LOGIN WIDGET ===== */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: "#000000" }}>
        <div className="container max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <h2 className="font-serif text-xl text-ivory mb-2 font-medium">Sign In</h2>
            <p className="text-ivory/40 font-light text-sm mb-8">
              Access your reservations, trip history, and account details.
            </p>
            <div className="gold-rule mb-8" />

            <a
              href="https://book.mylimobiz.com/v4/kingandcarter/widget/login"
              data-ores-widget="login"
              data-ores-alias="kingandcarter"
              data-redirect-url={window.location.origin + '/'}
            >
              Login
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

