"use client";

import { motion } from "framer-motion";
import { TrendingUp, User, Award, CheckCircle } from "lucide-react";

const stories = [
  {
    name: "Aria K. (Age 12)",
    achievement: "Candidate Master Title",
    climb: "+1,050 ELO Points",
    timeframe: "14 Months of Training",
    progression: [600, 950, 1400, 1850, 2150],
    peak: "2150 ELO",
    testimonial: "The calculation syllabus and FIDE-Master 1-on-1 matches gave me the confidence to win my state championships.",
  },
  {
    name: "Vikram S.",
    achievement: "Adult League Winner",
    climb: "+800 ELO Points",
    timeframe: "9 Months of Training",
    progression: [800, 1050, 1200, 1450, 1600],
    peak: "1600 ELO",
    testimonial: "As a working software engineer, standard courses didn't fit. BrainSeekers adapted completely to my logical way of thinking.",
  },
];

export default function SuccessStories() {
  return (
    <section id="success" className="py-14 md:py-24 bg-navy-950 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-royal-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="font-display text-base font-semibold tracking-wider uppercase text-royal-500">
            Student Progress
          </h2>
          <p className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Proven Rating Growth
          </p>
          <p className="mt-4 text-sm sm:text-lg text-slate-400">
            Chess is about quantifiable growth. See how our structured curriculum directly correlates with real ELO progression.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {stories.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-5 md:space-y-6">
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-display font-extrabold text-xl md:text-2xl text-white">
                      {story.name}
                    </h3>
                    <p className="text-royal-400 text-sm font-semibold flex items-center gap-1.5 mt-1">
                      <Award className="w-4 h-4" />
                      {story.achievement}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {story.climb}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{story.timeframe}</p>
                  </div>
                </div>

                {/* Rating Growth Visualizer */}
                <div className="bg-slate-950/80 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-slate-500 mb-4 md:mb-6 uppercase">
                    ELO Progression (Peak: {story.peak})
                  </h4>
                  
                  {/* Simulated Chart Bars */}
                  <div className="flex justify-between items-end h-24 md:h-32 gap-2 md:gap-3 pt-4">
                    {story.progression.map((val, idx) => {
                      const minVal = Math.min(...story.progression);
                      const maxVal = Math.max(...story.progression);
                      const pct = minVal === maxVal ? 100 : 30 + ((val - minVal) / (maxVal - minVal)) * 70;
                      
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 md:gap-2">
                          <span className="text-[9px] md:text-[10px] font-mono font-bold text-slate-400">
                            {val}
                          </span>
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="w-full bg-gradient-to-t from-royal-600/60 to-royal-500 rounded-t-lg relative group cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                          </motion.div>
                          <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-mono">
                            M{idx * 3}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Testimonial Quote */}
                <p className="text-slate-300 italic text-sm leading-relaxed relative pl-4 border-l-2 border-royal-500/50">
                  &ldquo;{story.testimonial}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
