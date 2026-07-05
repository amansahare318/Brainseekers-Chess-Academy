"use client";

import { motion } from "framer-motion";
import { Check, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    name: "Strategic Basecamp",
    description: "Build strong foundational understanding, board coordination, and standard opening configurations in active group setups.",
    price: "$149",
    billing: "per month",
    level: "Beginner & Intermediate",
    popular: false,
    features: [
      "2 Live Group Sessions / week (90m)",
      "Structured Homework & Tactics sheets",
      "Monthly inter-academy tournament access",
      "Academy Portal access & Chess.com membership discount",
      "Standard tutor chat support",
    ],
  },
  {
    name: "Tactical Ascent",
    description: "Refine candidate-move calculations, study complex endgames, and participate in personalized rating-progression evaluations.",
    price: "$299",
    billing: "per month",
    level: "Intermediate & Advanced",
    popular: true,
    features: [
      "3 Live Group Sessions / week",
      "1 Bi-weekly Private 1-on-1 Review (60m)",
      "Custom ELO progress tracking dashboards",
      "Weekly annotated PGN games from coaches",
      "Priority WhatsApp coach communication line",
      "Weekly masterclass recording database access",
    ],
  },
  {
    name: "Masterclass Apex",
    description: "Tailored 1-on-1 grandmaster-level training to prepare for tournaments, build specific repertoires, and claim official titles.",
    price: "$599",
    billing: "per month",
    level: "Elite & Tournament Competitors",
    popular: false,
    features: [
      "Unlimited FIDE Master/IM 1-on-1 hours (up to 3 / week)",
      "Engine-analyzed opening database repository",
      "Full live tournament game post-mortem analysis",
      "Psychological & stamina prep workshops",
      "FIDE rating points scoring roadmap",
    ],
  },
];

export default function Courses() {
  return (
    <section id="courses" className="py-14 md:py-24 relative overflow-hidden bg-navy-950">
      {/* Background glow elements */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-royal-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="font-display text-base font-semibold tracking-wider uppercase text-royal-500">
            Courses & Pricing
          </h2>
          <p className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Programs Tailored for Every Ambition
          </p>
          <p className="mt-4 text-sm sm:text-lg text-slate-400">
            All programs feature high-quality interactive boards, professional materials, and direct coaching review. Choose the trajectory that fits your goals.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {courses.map((course, i) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl relative flex flex-col justify-between transition-all duration-300 ${
                course.popular
                  ? "border-royal-500 bg-navy-900/60 shadow-2xl shadow-royal-500/10 lg:scale-[1.03]"
                  : "border-white/5"
              }`}
            >
              {course.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-royal-600 text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}

              <div className="space-y-5 md:space-y-6">
                <div>
                  <span className="text-xs font-semibold text-royal-400 uppercase tracking-wider block mb-2">
                    {course.level}
                  </span>
                  <h3 className="font-display font-extrabold text-xl md:text-2xl text-white">
                    {course.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <ul className="space-y-3 md:space-y-4">
                  {course.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-royal-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5">
                <Link
                  href="#trial"
                  className={`flex items-center justify-center w-full px-6 py-3 md:py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    course.popular
                      ? "bg-royal-600 text-white hover:bg-royal-500 shadow-lg hover:shadow-royal-500/20"
                      : "bg-slate-900 text-slate-300 hover:text-white border border-white/10 hover:border-royal-500"
                  }`}
                >
                  Start Booking
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
