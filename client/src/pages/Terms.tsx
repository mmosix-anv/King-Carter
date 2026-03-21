import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    id: "messaging",
    title: "Messaging Terms and Conditions",
    items: [
      "The messaging program consists of general conversational messaging to answer questions and provide support to customers.",
      "You can cancel the SMS service at any time. Just text 'STOP' to the phone number from which you received messages. After you send the SMS message 'STOP' to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.",
      "If you are experiencing issues with the messaging program you can reply with the keyword HELP for more assistance, or you can get help directly at Info@kingandcarter.com.",
      "Carriers are not liable for delayed or undelivered messages.",
      "As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency will vary based on communication needs. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.",
      "If you have any questions regarding privacy, please read our privacy policy contained in the rest of this document.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    items: [
      "King & Carter Premier is committed to protecting your personal information. Any data collected through our website, booking system, or communications is used solely to coordinate your transportation services.",
      "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as required to provide our services or comply with the law.",
      "We may collect information such as your name, phone number, email address, and pickup/dropoff locations to fulfill reservations and communicate with you about your bookings.",
      "You may request access to, correction of, or deletion of your personal data at any time by contacting us at Info@kingandcarter.com.",
      "Our website may use cookies to enhance your browsing experience. You may choose to disable cookies through your browser settings.",
      "We reserve the right to update this policy at any time. Continued use of our services constitutes acceptance of any changes.",
    ],
  },
  {
    id: "service",
    title: "Terms of Service",
    items: [
      "By booking a ride with King & Carter Premier, you agree to these terms and conditions in full.",
      "All reservations are subject to vehicle availability. We reserve the right to substitute vehicles of equal or greater value when necessary.",
      "Cancellations must be made at least 24 hours prior to the scheduled pickup time to avoid cancellation fees. Late cancellations or no-shows may be charged the full trip amount.",
      "King & Carter Premier is not responsible for delays caused by traffic, weather, or other circumstances beyond our control.",
      "Passengers are responsible for any damage caused to vehicles during their trip. Cleaning fees may apply for excessive mess.",
      "King & Carter Premier reserves the right to refuse service to any passenger who is behaving in a manner that is unsafe, disruptive, or disrespectful to our drivers.",
      "These terms are governed by the laws of the State of Georgia.",
    ],
  },
];

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-16 lg:pt-48 lg:pb-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-4">Legal</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory font-medium leading-tight mb-6">
              Terms &amp; <span className="font-light text-gold">Conditions</span>
            </h1>
            <p className="text-ivory/40 font-light text-sm leading-relaxed max-w-xl">
              Please read these terms carefully. By using our services you agree to the policies outlined below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gold rule */}
      <div className="container max-w-4xl">
        <div className="gold-rule mb-16" />
      </div>

      {/* Content */}
      <section className="pb-32">
        <div className="container max-w-4xl">
          <div className="flex flex-col gap-16">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h2 className="font-serif text-xl lg:text-2xl text-ivory font-medium mb-6">
                  {section.title}
                </h2>
                <ol className="flex flex-col gap-4">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-4">
                      <span className="text-gold/60 font-light text-sm mt-0.5 shrink-0 w-5 text-right">
                        {j + 1}.
                      </span>
                      <p className="text-ivory/55 font-light text-sm leading-relaxed">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
                {i < SECTIONS.length - 1 && (
                  <div className="gold-rule mt-16 opacity-20" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-16 pt-10 border-t border-white/5">
            <p className="text-ivory/30 text-xs font-light leading-relaxed">
              For questions about these terms, contact us at{" "}
              <a
                href="mailto:Info@kingandcarter.com"
                className="text-gold/60 hover:text-gold transition-colors"
              >
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
