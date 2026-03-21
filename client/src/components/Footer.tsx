/*
 * DESIGN: Cinematic Noir Footer
 * Minimal, dark footer with gold accents and thin rule divider.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase, Service } from "@/lib/supabase";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Become a Member", href: "/become-a-member" },
  { label: "Contact", href: "/contact" },
  { label: "Brochure", href: "https://brochure.kingandcarter.com", external: true },
];

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('title, slug')
        .eq('status', 'published')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  }
  return (
    <footer className="bg-[#060606] border-t border-white/5">
      <div className="container py-20 lg:py-28">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-16">
          {/* Brand */}
          <div>
            <Link href="/">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663383946852/XmPp3EMAhtE96ppfU4CNgK/king-carter-logo-bright_175fd0e0.png"
                alt="King & Carter"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-6 text-sm text-ivory/65 leading-relaxed font-light max-w-xs">
              Premium ground transportation shaped by hospitality, discretion, and modern elegance.
            </p>
                <div className="mt-2 ml-0">
                  <p className="text-sm text-ivory/65 font-light">Atlanta, Georgia</p>
                  <p className="text-sm text-ivory/65 font-light mt-1">info@kingandcarter.com</p>
                </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="section-label mb-6">Services</h4>
            <ul className="space-y-3">
              {services.length === 0 ? (
                <li className="text-sm text-ivory/55 font-light">Loading...</li>
              ) : (
                services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`}>
                      <span className="text-sm text-ivory/75 hover:text-gold transition-colors duration-300 font-light">
                        {service.title}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="section-label mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <span className="text-sm text-ivory/75 hover:text-gold transition-colors duration-300 font-light">
                    About Us
                  </span>
                </Link>
              </li>
              {companyLinks.slice(1).map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-ivory/75 hover:text-gold transition-colors duration-300 font-light"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <span className="text-sm text-ivory/75 hover:text-gold transition-colors duration-300 font-light">
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="gold-rule opacity-30 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/55 font-light tracking-wide">
            &copy; {new Date().getFullYear()} King & Carter Premier. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy">
              <span className="text-xs text-ivory/55 hover:text-ivory/80 transition-colors cursor-pointer font-light">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms">
              <span className="text-xs text-ivory/55 hover:text-ivory/80 transition-colors cursor-pointer font-light">
                Terms & Conditions
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
