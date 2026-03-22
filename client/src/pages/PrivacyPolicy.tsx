import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "Data Collection",
    body: "We will collect your name, email address, mailing address, and mobile phone number when you sign up for SMS updates. This information will be collected via the website contact form, email, rental agreement, or third-party reservation systems.",
  },
  {
    title: "Data Usage",
    body: "We use your data solely for sending informational messages.",
  },
  {
    title: "Data Security",
    body: "We protect your data with secure storage measures to prevent unauthorized access.",
  },
  {
    title: "Data Retention",
    body: "We retain your information as long as you are subscribed to our SMS service. You may request deletion at any time.",
  },
  {
    title: "Message & Data Rates",
    body: "MESSAGE AND DATA RATES MAY APPLY. Your mobile carrier may charge fees for sending or receiving text messages, especially if you do not have an unlimited texting or data plan. Messages are recurring and message frequency varies.",
  },
  {
    title: "Contact & Support",
    body: "Contact King & Carter Group DBA King & Carter Premier at (770) 766-0383 or Info@kingandcarter.com for HELP or to STOP receiving messages. You can send HELP for additional assistance, and you will receive a text including our phone number, email, and website.",
  },
  {
    title: "Opt-Out",
    body: "You can opt out of the SMS list at any time by texting, emailing, or replying STOP to Info@kingandcarter.com or (770) 766-0383. After unsubscribing, you will receive a final SMS to confirm you have been unsubscribed and we will remove your number from our list within 24 hours.",
  },
  {
    title: "Non-Sharing Clause",
    body: "We do not share your data with third parties for marketing purposes. King & Carter Group DBA King & Carter Premier will not sell, rent, or share the collected mobile numbers.",
  },
];

export default function PrivacyPolicy() {
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
              Privacy <span className="font-light text-gold">Policy</span>
            </h1>
            <p className="text-ivory/65 font-light text-sm leading-relaxed max-w-xl mb-2">
              King & Carter Group DBA King & Carter Premier Privacy Policy
            </p>
            <p className="text-ivory/65 font-light text-sm leading-relaxed max-w-xl">
              King & Carter Group DBA King & Carter Premier respects your privacy. By opting into our SMS messaging service, you agree to the following terms regarding how we handle your data.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-4xl">
        <div className="gold-rule mb-16" />
      </div>

      <section className="pb-32">
        <div className="container max-w-4xl">
          <div className="flex flex-col gap-10">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2 className="font-serif text-base lg:text-lg text-ivory font-medium mb-2">
                  {section.title}
                </h2>
                <p className="text-ivory/75 font-light text-sm leading-relaxed">{section.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-white/5">
            <p className="text-ivory/55 text-xs font-light leading-relaxed">
              For questions about this policy, contact us at{" "}
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
