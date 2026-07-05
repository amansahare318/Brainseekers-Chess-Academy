"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Trophy } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const navLinks = [
  { name: "Why Us", href: "#why-us" },
  { name: "Journey", href: "#journey" },
  { name: "Courses", href: "#courses" },
  { name: "Coaches", href: "#coaches" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Success Stories", href: "#success" },
];

export default function Navbar() {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const brandName = settings.academyName || "BrainSeekers";
  const tagline = settings.tagline || "Master the Game. Sharpen the Mind.";
  const logoSrc = settings.logo?.url || "/logo.png";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/80 backdrop-blur-md border-b border-white/5 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoSrc}
                alt={`${brandName} Logo`}
                fill
                sizes="48px"
                className="object-contain"
                priority
                unoptimized={!!settings.logo?.url}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none tracking-tight bg-gradient-to-r from-white via-slate-200 to-royal-400 bg-clip-text text-transparent">
                {brandName}
              </span>
              <span className="text-[8px] font-medium tracking-widest text-slate-400 mt-1 uppercase leading-tight">
                Master the Game<br />Sharpen the Mind.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-royal-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Portal Login
            </Link>
            <Link
              href="/trial-class"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-royal-600 to-royal-500 text-sm font-semibold text-white shadow-lg hover:from-royal-500 hover:to-royal-600 transition-all duration-300 hover:shadow-royal-500/25 hover:scale-[1.02]"
            >
              Book Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-b border-white/5 bg-navy-950/95 backdrop-blur-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full px-5 py-3 rounded-full border border-white/10 bg-slate-800/40 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-700/50 transition-all"
                >
                  <Trophy className="w-4 h-4 text-royal-400" />
                  Portal Login
                </Link>
                <Link
                  href="/trial-class"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-gradient-to-r from-royal-600 to-royal-500 text-sm font-semibold text-white shadow-lg hover:from-royal-500 hover:to-royal-600 transition-all"
                >
                  Book Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
