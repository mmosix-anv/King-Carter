import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ITEMS = [
  "The messaging program consists of general conversational messaging to answer questions and provide support to customers.",
  "You can cancel the SMS service at any time. Just text STOP to the phone number from which you received messages. After you send the SMS message STOP to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time, and we will start sending SMS messages to you again.",
  "If you are experiencing issues with the messaging program, you can reply with the keyword HELP for more assistance, or you can get help directly at Info@kingandcarter.com.",
  "Carriers are not liable for delayed or undelivered messages.",
  "As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency will vary based on communication needs. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.",
  "If you have any questions regarding privacy, please read our privacy policy.",
];

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      <section className="pt-40 pb-16 lg:pt-48 lg:pb-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-4">Legal</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory font-medium leading-tight mb-4">
              Terms &amp; <span className="font-light text-gold">Conditions</span>
            </h1>
            <p className="text-ivory/65 font-light text-sm leading-relaxed max-w-xl">
              King & Carter Group DBA King & Carter Premier
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-4xl">
        <div className="gold-rule mb-16" />
      </div>

      <section className="pb-32">
        <div className="container max-w-4xl">
          <motion.ol
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {ITEMS.map((item, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-gold/60 font-light text-sm mt-0.5 shrink-0 w-5 text-right">
                  {i + 1}.
                </span>
                <p className="text-ivory/75 font-light text-sm leading-relaxed">
                  {i === 5 ? (
                    <>
                      If you have any questions regarding privacy, please read our{" "}
                      <Link href="/privacy">
                        <span className="text-gold/70 hover:text-gold transition-colors cursor-pointer">
                          privacy policy
                        </span>
                      </Link>
                      .
                    </>
                  ) : (
                    item
                  )}
                </p>
              </li>
            ))}
          </motion.ol>

          <div className="mt-16 pt-10 border-t border-white/5">
            <p className="text-ivory/55 text-xs font-light leading-relaxed">
              For questions, contact us at{" "}
              <a href="mailto:Info@kingandcarter.com" className="text-gold/70 hover:text-gold transition-colors">
                Info@kingandcarter.com
              </a>
              . Last updated {new Date().getFullYear()}.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
