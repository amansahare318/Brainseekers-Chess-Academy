"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Target, Clock, BookOpen, Award, CheckCircle } from "lucide-react";

const stages = [
  {
    id: "beginner",
    num: "01",
    name: "Beginner",
    tagline: "Foundations of Chess Strategy",
    rating: "Under 800 ELO",
    duration: "2 - 3 Months",
    desc: "Establish a complete vocabulary of chess moves, terminology, basic checkmate patterns, and piece configurations.",
    curriculum: [
      "Board Coordinates & Piece Mechanics",
      "Core Tactical Patterns (Forks, Pins, Skewers)",
      "Simple Checkmate Algorithms (Rook Roller, Scholar)",
      "General Opening Safety Principles",
    ],
  },
  {
    id: "intermediate",
    num: "02",
    name: "Intermediate",
    tagline: "Symmetry & Positional Logic",
    rating: "800 - 1200 ELO",
    duration: "4 - 6 Months",
    desc: "Develop strategic foresight. Begin calculating moves ahead, studying pawn structures, and navigating closed positions.",
    curriculum: [
      "Introduction to Chess Openings (e.g. Italian, Sicilian)",
      "Basic Endgames (King & Pawn, Rook & Pawn)",
      "Prophylaxis & Positional Weaknesses",
      "Dynamic Tactical Combinations",
    ],
  },
  {
    id: "advanced",
    num: "03",
    name: "Advanced",
    tagline: "Deep Strategic Mastery",
    rating: "1200 - 1600 ELO",
    duration: "6 - 9 Months",
    desc: "Refine candidate moves selection, master piece coordination, and execute structural transitions during high-pressure games.",
    curriculum: [
      "Specialized Opening Repertoires (White & Black)",
      "Advanced Middle-Game Planning & Schemes",
      "Minor Piece Endgames & Positional Sacrifices",
      "Intuitive & Calculative Chess Methods",
    ],
  },
  {
    id: "tournament",
    num: "04",
    name: "Tournament",
    tagline: "Competitive Mastery & Resilience",
    rating: "1600 - 2000 ELO",
    duration: "Ongoing Coaching",
    desc: "Analyze modern opening theoretical changes. Build high-stakes endurance, mental toughness, and tournament clock management.",
    curriculum: [
      "Opponent Profiling & Anti-Computer Prep",
      "Complexity Resolution under Time Trouble",
      "FIDE Standard Classical Chess Protocols",
      "Deep Engine Analysis Integration",
    ],
  },
  {
    id: "champion",
    num: "05",
    name: "Champion",
    tagline: "Grandmaster-Level Strategy",
    rating: "2000+ ELO / Title Chase",
    duration: "Elite Group & 1-on-1",
    desc: "Direct support from International Masters and Grandmasters to fine-tune elite gameplay and secure official titles.",
    curriculum: [
      "Bespoke Opening Innovations & Novelties",
      "Highest Level Prophylactic Thinking",
      "Tournament Strategy & Title Scoring Protocols",
      "Elite Training Camps & Master Forums",
    ],
  },
];

export default function LearningJourney() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="journey" className="py-14 md:py-24 relative overflow-hidden bg-navy-950/40">
      {/* Background visual element */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-royal-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h2 className="font-display text-base font-semibold tracking-wider uppercase text-royal-500">
            The Learning Journey
          </h2>
          <p className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our Structured Development Pathway
          </p>
          <p className="mt-4 text-sm sm:text-lg text-slate-400">
            From absolute first moves to championship masterclasses, see how our curriculum evolves alongside your ELO rating.
          </p>
        </div>

        {/* Pathway Steps — scrollable on mobile */}
        <div className="flex overflow-x-auto md:flex-wrap lg:flex-nowrap gap-2 md:gap-4 mb-8 md:mb-12 border-b border-white/5 pb-0 md:pb-6 scrollbar-hide">
          {stages.map((stage, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveIdx(idx)}
                className={`relative flex-shrink-0 md:flex-1 px-4 py-3 md:py-4 text-left focus:outline-none group cursor-pointer rounded-t-lg transition-colors ${
                  isSelected ? "bg-royal-500/10" : "hover:bg-white/5"
                } md:bg-transparent md:hover:bg-transparent`}
              >
                <span className="relative z-10 space-y-1 block">
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${isSelected ? "text-royal-500" : "text-slate-500 group-hover:text-slate-400"} transition-colors block`}>
                    {stage.num}
                  </span>
                  <span className={`font-display font-bold text-sm md:text-lg whitespace-nowrap ${isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-200"} transition-colors block`}>
                    {stage.name}
                  </span>
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="journeyTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-royal-600 to-royal-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start lg:items-center">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.4 }}
                className="space-y-5 md:space-y-6"
              >
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-500/10 border border-royal-500/20 text-xs font-semibold text-royal-400">
                    Stage {stages[activeIdx].num} Curriculum
                  </span>
                  <h3 className="font-display text-xl sm:text-3xl font-extrabold text-white">
                    {stages[activeIdx].tagline}
                  </h3>
                </div>

                <p className="text-slate-400 leading-relaxed text-sm sm:text-lg">
                  {stages[activeIdx].desc}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 bg-slate-900/50 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 max-w-md">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-royal-500 shrink-0" />
                    <div>
                      <h4 className="text-xs text-slate-500">Target Rating</h4>
                      <p className="text-xs md:text-sm font-semibold text-white">{stages[activeIdx].rating}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-royal-500 shrink-0" />
                    <div>
                      <h4 className="text-xs text-slate-500">Avg. Duration</h4>
                      <p className="text-xs md:text-sm font-semibold text-white">{stages[activeIdx].duration}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl relative"
              >
                <div className="absolute top-0 right-0 p-4 font-mono text-7xl font-extrabold text-slate-800/20 select-none">
                  {stages[activeIdx].num}
                </div>
                <h4 className="font-display font-bold text-white text-lg mb-5 md:mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-royal-500" />
                  Key Modules
                </h4>
                <ul className="space-y-3 md:space-y-4">
                  {stages[activeIdx].curriculum.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-royal-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
