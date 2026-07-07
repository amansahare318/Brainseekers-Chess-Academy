"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const settings = useSettings();
  const currentYear = new Date().getFullYear();
  const brandName = settings.academyName || "BrainSeekers";
  const tagline = settings.tagline || "Master the Game. Sharpen the Mind.";
  const logoSrc = settings.logo?.url || "/logo.png";

  return (
    <footer className="relative border-t border-white/5 bg-navy-950 pt-20 pb-10 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-royal-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-80 h-80 rounded-full bg-royal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src={logoSrc}
                  alt={brandName}
                  fill
                  sizes="48px"
                  className="object-contain"
                  unoptimized={!!settings.logo?.url}
                />
              </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none tracking-tight text-white">
                {brandName}
              </span>
              <span className="text-[8px] font-medium tracking-widest text-slate-400 mt-1 uppercase">
                {tagline}
              </span>
            </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.description ||
                "We empower aspiring minds to unlock strategic greatness, mental resilience, and technical excellence through the art and science of chess."}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-royal-500 transition-colors"
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-royal-500 transition-colors"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-royal-500 transition-colors"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6">Academy</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#why-us" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Why BrainSeekers
                </Link>
              </li>
              <li>
                <Link href="#journey" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Learning Journey
                </Link>
              </li>
              <li>
                <Link href="#courses" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Courses & Pricing
                </Link>
              </li>
              <li>
                <Link href="#coaches" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Meet the Coaches
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-royal-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  New Manish Nagar , Nagpur , Maharashtra.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-royal-500 shrink-0" />
                <a href="tel:+918485079068" className="text-slate-400 hover:text-white text-sm transition-colors">
                  +91 8485079068
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-royal-500 shrink-0" />
                <a href="mailto:brainseekerschessacademy@gmail.com" className="text-slate-400 hover:text-white text-sm transition-colors">
                  brainseekerschessacademy@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-6">
            <h3 className="font-display font-semibold text-white">Subscribe to Gambit</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get tactical puzzles, strategies, and masterclass updates delivered straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-2 p-2 rounded-lg bg-royal-600 text-white hover:bg-royal-500 transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            &copy; {currentYear} BrainSeekers Chess Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
