"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

const testimonials = [
  {
    quote: "BrainSeekers completely transformed how my son approaches problem-solving. It's not just about chess; his math and science grades have seen a noticeable improvement because he learned how to plan his decisions.",
    author: "Elena Rostova",
    role: "Parent of Leo (Under-10 Competitor)",
    rating: 5,
    tag: "Parent",
  },
  {
    quote: "The FIDE certified coaches are unbelievable. They break down Grandmaster games into easy-to-digest positional concepts. My tactical vision has sharpened tremendously, and I've gained 400 ELO points.",
    author: "Marcus Vance",
    role: "Adult Club Member",
    rating: 5,
    tag: "Adult Learner",
  },
  {
    quote: "The interactive boards and weekly tournament challenges are incredibly engaging. I look forward to the lessons every week. They make deep positional analysis feel fun and rewarding.",
    author: "Tariq Mahmood",
    role: "High School League Captain",
    rating: 5,
    tag: "Scholastic Competitor",
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 md:py-24 bg-navy-950/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-royal-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="font-display text-base font-semibold tracking-wider uppercase text-royal-500">
            Testimonials
          </h2>
          <p className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Loved by Parents & Competitors
          </p>
        </div>

        {/* Testimonials Grid — stack on mobile, 3-col on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl relative flex flex-col justify-between"
            >
              <div className="space-y-4 md:space-y-6">
                {/* Stars and icon */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <MessageSquare className="w-5 h-5 text-royal-500 opacity-35" />
                </div>

                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-white text-sm">
                    {t.author}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                </div>
                <span className="text-[10px] font-bold font-mono text-royal-400 bg-royal-950/40 border border-royal-500/10 px-2 py-0.5 rounded-md shrink-0">
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
