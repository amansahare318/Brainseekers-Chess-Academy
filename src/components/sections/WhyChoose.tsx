"use client";

import { motion } from "framer-motion";
import { Award, Cpu, Globe, Zap, Target, BookOpen } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Grandmaster Pedigree",
    description: "Learn from certified FIDE masters and international title holders. Our coaches have trained top-tier competitive junior champions.",
  },
  {
    icon: Cpu,
    title: "Interactive Training Arena",
    description: "Work on advanced interactive visual chessboards. Integrate engine analysis directly during active live coaching sessions.",
  },
  {
    icon: Target,
    title: "Cognitive Performance Metrics",
    description: "Gain insight into your tactics, opening accuracy, and endgame discipline with structured academy-proprietary reports.",
  },
  {
    icon: Globe,
    title: "Global Arena Matchups",
    description: "Participate in weekly inter-academy tournaments. Gain practical experience by matching up with global rated players.",
  },
];

export default function WhyChoose() {
  return (
    <section id="why-us" className="py-14 md:py-24 relative overflow-hidden bg-navy-950">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-royal-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-base font-semibold tracking-wider uppercase text-royal-500"
          >
            Why BrainSeekers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            The Intelligent Alternative to Standard Coaching
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-sm sm:text-lg text-slate-400"
          >
            Our strategy-first syllabus builds critical logical foundations that translate into competitive chess victories and sharper real-world decision making.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-panel glass-panel-hover p-6 md:p-10 rounded-2xl md:rounded-3xl relative overflow-hidden group"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-royal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-royal-950/50 border border-royal-500/20 flex items-center justify-center text-royal-400 group-hover:text-royal-300 group-hover:border-royal-500/50 transition-colors duration-300">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-royal-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
