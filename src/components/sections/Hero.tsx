"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Award, Zap } from "lucide-react";

// Inline SVG paths for clean, high-performance chess pieces
const ChessKnight = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-royal-500 fill-current opacity-25 filter drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">
    <path d="M35 15c-5 0-9 4-9 9 0 3 1.5 6 4 7.5-6.5.5-12 5.5-13 12.5C16 51 22 58.5 29 60c2 3.5 5.5 6.5 9.5 7.5v12.5H23v5h54v-5H62.5V67.5c7-2.5 11.5-9.5 11.5-17.5 0-14-11-25-25-25-3 0-5.5.5-8 1.5.5-1 1-2.5 1-4 0-4-3-7.5-7-7.5zm0 5c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5-2.5-1-2.5-2.5S33.5 20 35 20z" />
  </svg>
);

const ChessRook = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-royal-400 fill-current opacity-20 filter drop-shadow-[0_0_15px_rgba(96,165,250,0.2)]">
    <path d="M22 15v10h8v8h12v-8h16v8h12v-8h8V15H22zm4 15h48v42H26V30zm-4 46h56v10H22V76zm-4 13v5h64v-5H18z" />
  </svg>
);

const ChessPawn = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-royal-600 fill-current opacity-30 filter drop-shadow-[0_0_10px_rgba(37,99,235,0.2)]">
    <path d="M50 15c-7 0-13 6-13 13 0 4.5 2.5 8.5 6 10.5-8 3-14 10-14 18.5h42c0-8.5-6-15.5-14-18.5 3.5-2 6-6 6-10.5 0-7-6-13-13-13zm-20 48v5h40v-5H30zm-4 9v5h48v-5H26zm-4 9v5h56v-5H22z" />
  </svg>
);

const ChessKing = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-royal-500 fill-current opacity-15 filter drop-shadow-[0_0_20px_rgba(37,99,235,0.2)]">
    <path d="M47.5 10v6h-6v5h6v6h5v-6h6v-5h-6v-6h-5zm-15 17v7h35v-7H32.5zm0 11l-5 19h45l-5-19H32.5zm-5 23l-3 15h51l-3-15H27.5zm-7 19v5h59v-5H20.5z" />
  </svg>
);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Framer Motion Springs for ultra-smooth interactive parallax
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const springX = useSpring(xValue, { stiffness: 60, damping: 20 });
  const springY = useSpring(yValue, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize mouse positions between -0.5 and 0.5
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      
      xValue.set(x * 50); // maximum movement pixels
      yValue.set(y * 50);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [xValue, yValue]);

  // Derived transforms for layer depth effects
  const bgParallaxX = useTransform(springX, (value) => value * 0.3);
  const bgParallaxY = useTransform(springY, (value) => value * 0.3);
  const midParallaxX = useTransform(springX, (value) => value * 0.8);
  const midParallaxY = useTransform(springY, (value) => value * 0.8);
  const foreParallaxX = useTransform(springX, (value) => value * 1.5);
  const foreParallaxY = useTransform(springY, (value) => value * 1.5);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen md:flex md:items-center md:justify-center overflow-hidden bg-navy-950 pt-24 pb-16 md:pb-0"
    >
      {/* 1. Animated living chessboard background */}
      <motion.div
        style={{ x: bgParallaxX, y: bgParallaxY }}
        className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none"
      >
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isDark = (row + col) % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: isDark ? 0.3 : 0.05 }}
              transition={{
                delay: (row + col) * 0.05,
                duration: 1,
              }}
              className={`w-full h-full border-[0.5px] border-royal-500/10 ${
                isDark ? "bg-royal-950/20" : "bg-transparent"
              }`}
            />
          );
        })}
      </motion.div>

      {/* Floating ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-royal-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-royal-500/10 blur-[150px] pointer-events-none" />

      {/* 2. Interactive floating chess pieces (Parallax Depth Layering) */}
      {/* King - Deep Background */}
      <motion.div
        style={{ x: bgParallaxX, y: bgParallaxY }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-10 md:left-24 w-28 h-28 pointer-events-none hidden md:block"
      >
        <ChessKing />
      </motion.div>

      {/* Knight - Mid-ground Left */}
      <motion.div
        style={{ x: midParallaxX, y: midParallaxY }}
        animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-6 md:left-48 w-32 h-32 pointer-events-none hidden md:block"
      >
        <ChessKnight />
      </motion.div>

      {/* Rook - Mid-ground Right */}
      <motion.div
        style={{ x: midParallaxX, y: midParallaxY }}
        animate={{ y: [0, -18, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-10 md:right-40 w-36 h-36 pointer-events-none hidden md:block"
      >
        <ChessRook />
      </motion.div>

      {/* Pawn - Foreground Right */}
      <motion.div
        style={{ x: foreParallaxX, y: foreParallaxY }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-1/3 right-10 md:right-28 w-24 h-24 pointer-events-none hidden md:block"
      >
        <ChessPawn />
      </motion.div>

      {/* 3. Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 md:pt-0">
        {/* Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/5 backdrop-blur-md mb-8 text-xs font-semibold text-royal-400"
        >
          <Award className="w-4 h-4 text-royal-500" />
          <span>FIDE Standard Academy</span>
          <span className="w-1.5 h-1.5 rounded-full bg-royal-500 animate-ping" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]"
        >
          Transforming Beginners into{" "}
          <span className="relative bg-gradient-to-r from-royal-400 via-royal-500 to-royal-600 bg-clip-text text-transparent glow-text-blue">
            Champions
          </span>
        </motion.h1>

        {/* Subtitle / Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Elevate your logic, spatial intelligence, and psychological resilience with expert live chess training.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="#trial"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-royal-600 to-royal-500 text-base font-bold text-white shadow-xl shadow-royal-500/20 hover:from-royal-500 hover:to-royal-600 hover:shadow-royal-500/35 transition-all duration-300 hover:scale-[1.03]"
          >
            Claim Free Live Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#courses"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900/90 border border-white/10 hover:border-royal-500 text-base font-bold text-slate-200 hover:text-white transition-all duration-300 hover:scale-[1.03]"
          >
            Explore Courses
          </Link>
        </motion.div>

        {/* Academy Metrics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-10 md:mt-20 pt-8 md:pt-10 border-t border-white/5"
        >
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white">0</h3>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Students Worldwide</p>
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white">0</h3>
            <p className="text-xs md:text-sm text-slate-500 mt-1">FIDE Certified Coaches</p>
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white">0</h3>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Tournament Medals</p>
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white">0%</h3>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Rating Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
