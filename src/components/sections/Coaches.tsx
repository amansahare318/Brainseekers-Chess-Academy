"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Star, Trophy } from "lucide-react";
import { fetchPublicCoaches, ApiCoach } from "@/lib/coaches";

export default function Coaches() {
  const [coaches, setCoaches] = useState<ApiCoach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicCoaches()
      .then((data) => setCoaches(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!coaches || coaches.length === 0) return null;

  return (
    <section id="coaches" className="py-14 md:py-24 bg-navy-950/40 relative overflow-hidden">
      {/* Decorative side grid */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-royal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="font-display text-base font-semibold tracking-wider uppercase text-royal-500">
            Meet the Instructors
          </h2>
          <p className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Coached by Certified Masters
          </p>
          <p className="mt-4 text-sm sm:text-lg text-slate-400">
            Get mentored by real-world tournament winners and grandmaster theorists who know what it takes to climb the competitive ratings.
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {coaches.map((coach, i) => (
            <motion.div
              key={coach._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel rounded-2xl md:rounded-3xl overflow-hidden group flex flex-col h-full"
            >
              {/* Image Frame — shorter on mobile */}
              <div className="relative h-60 md:h-96 w-full overflow-hidden bg-slate-900">
                <Image
                  src={coach.photoUrl || "/logo.png"}
                  alt={coach.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-90" />
                
                {/* Master Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-royal-600/90 backdrop-blur-md border border-royal-500/30 text-xs font-bold text-white flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  {coach.title}
                </div>
              </div>

              {/* Info Details */}
              <div className="p-5 md:p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-extrabold text-lg md:text-xl text-white">
                      {coach.name}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-royal-400 bg-royal-950/40 px-2 py-1 rounded-md border border-royal-500/10 shrink-0">
                      {coach.elo} ELO
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Dedicated chess coach committed to helping students achieve their goals and improve their strategic thinking.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-royal-500" />
                    Professional Coach
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-royal-500 fill-royal-500" />
                    FIDE Certified
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
