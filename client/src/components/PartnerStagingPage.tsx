/*
 * Partner staging page — a standalone black-and-gold King & Carter transportation
 * card shared with a hotel or venue for review. Deliberately has no site header,
 * footer or nav: it is a self-contained handoff, and prints as a concierge card.
 *
 * Ported from the kartonzawolo staging repos, which are byte-identical apart from
 * the venue name, so all three routes render this one component.
 * Styles live in styles/partner-pages.css, scoped under .reference-page.
 */
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  Globe2,
  Mail,
  Phone,
  Plane,
  UsersRound,
} from "lucide-react";
import useSEO from "@/hooks/useSEO";
import "@/styles/partner-pages.css";

const MAIN_SITE_URL = "https://kingandcarter.com/";
const PHONE_DISPLAY = "770 766 0383";
const PHONE_LINK = "tel:+17707660383";
const CONTACT_EMAIL = "reservations@kingandcarter.com";

/* The site lockup, already used by the header and footer. The prototypes pointed
   at a Manus-hosted copy of the same mark, which is not publicly reachable. */
const LOGO_URL = "/images/logo.png";
  
const services = [
  {
    title: "Airport\nTransfer",
    copy: "Seamless airport transfers to and from ATL.",
    icon: Plane,
  },
  {
    title: "Executive\nTransportation",
    copy: "Transportation for business, meetings, and special occasions.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Hourly\nChauffeur",
    copy: "Dedicated chauffeur and vehicle by the hour.",
    icon: Clock3,
  },
  {
    title: "Group\nTransportation",
    copy: "Executive Sprinter and group transportation available.",
    icon: UsersRound,
  },
];

const BrandLockup = ({ className = "" }: { className?: string }) => (
  <img className={`brand-lockup ${className}`} src={LOGO_URL} alt="King & Carter Premiere" />
);

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;600;700;800&display=swap";

/* Fallback until a venue has its own agent-attributed booking link. */
const DEFAULT_BOOKING_URL = "https://kingandcarter.com/";

interface PartnerStagingPageProps {
  /** Venue name shown in the hero, e.g. "Hotel Phoenix". */
  venue: string;
  /** Venue name used in the disclosure line, when it differs from the hero. */
  disclosureVenue?: string;
  /** City line under the venue name. */
  location?: string;
  /**
   * Venue-specific booking link. These carry an ?agent= parameter that credits the
   * booking to the venue, so each page must pass its own.
   */
  bookingUrl?: string;
}

export default function PartnerStagingPage({
  venue,
  disclosureVenue,
  location = "Atlanta",
  bookingUrl = DEFAULT_BOOKING_URL,
}: PartnerStagingPageProps) {
  const [qrImage, setQrImage] = useState("");

  useSEO({
    title: `${venue} × King & Carter | Executive Transportation`,
    description: `Private chauffeur and executive transportation for guests of ${venue} in ${location}, provided by King & Carter.`,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* The prototypes set their type in Cormorant Garamond and Manrope, which the rest
     of the site does not load. Injecting the stylesheet here keeps the cost on these
     three routes rather than every page. */
  useEffect(() => {
    const href = FONT_HREF;
    if (document.querySelector('link[data-partner-fonts]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-partner-fonts", "");
    document.head.appendChild(link);
  }, []);

  /* Encodes the venue booking link, not this page, so a scan from a printed card
     goes straight to the agent-attributed booking flow. */
  useEffect(() => {
    QRCode.toDataURL(bookingUrl, {
      width: 760,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#080808", light: "#ffffff" },
    })
      .then(setQrImage)
      .catch(() => setQrImage(""));
  }, [bookingUrl]);

  return (
    <div className="reference-page">
      <div className="city-shade" aria-hidden="true" />
      <main className="reference-shell">
        <section className="reference-hero" aria-labelledby="page-title">
          <a href={MAIN_SITE_URL} target="_blank" rel="noreferrer" className="hero-brand">
            <BrandLockup />
          </a>

          <div className="hotel-title">
            <p>{venue}</p>
            <div className="hotel-location">
              <span />
              <b>{location}</b>
              <span />
            </div>
          </div>

          <h1 id="page-title">Your Atlanta journey, thoughtfully arranged.</h1>
          <a className="reference-book-button" href={bookingUrl} target="_blank" rel="noreferrer">
            <span>Book transportation</span>
            <ArrowUpRight size={20} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <p className="booking-note">
            Reservations open in the King &amp; Carter booking experience.
          </p>
        </section>

        <div className="gold-rule section-rule" aria-hidden="true">
          <i />
        </div>

        <section className="service-grid" aria-label="Transportation services">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="reference-service" key={service.title}>
                <Icon className="service-icon" size={45} strokeWidth={1.35} aria-hidden="true" />
                <h2>
                  {service.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p>{service.copy}</p>
              </article>
            );
          })}
        </section>

        <section className="reference-qr-section" aria-label="Scan to book transportation">
          <div className="qr-card-reference">
            <div className="qr-code-wrap">
              {qrImage ? (
                <img src={qrImage} alt="QR code to book King & Carter transportation" />
              ) : (
                <span>
                  Preparing
                  <br />
                  QR
                </span>
              )}
            </div>
            <p>Scan to book</p>
          </div>
          <p className="qr-supporting-copy">
            Private chauffeur and executive transportation provided by King &amp; Carter.
          </p>
        </section>
      </main>

      <footer className="reference-footer">
        <div className="footer-inner">
          <BrandLockup className="footer-lockup" />
          <div className="footer-contact">
            <a href={PHONE_LINK}>
              <Phone size={16} aria-hidden="true" /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={16} aria-hidden="true" /> {CONTACT_EMAIL}
            </a>
          </div>
          <a className="footer-web" href={MAIN_SITE_URL} target="_blank" rel="noreferrer">
            <Globe2 size={17} aria-hidden="true" /> kingandcarter.com
          </a>
        </div>
        <p className="reference-disclosure">
          Transportation services are provided and operated by King &amp; Carter. Staging preview
          for {disclosureVenue ?? venue} review.
        </p>
      </footer>
    </div>
  );
}