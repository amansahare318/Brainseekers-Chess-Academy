"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, CheckCircle, Award, MessageCircle } from "lucide-react";
import { createLeadPublic } from "@/lib/leads";
import { apiRequest, ApiError } from "@/lib/api";
import { ChessLevel } from "@/types/academy";

function mapLevel(level: string): ChessLevel {
  if (level.includes("Intermediate")) return "Intermediate";
  if (level.includes("Advanced") || level.includes("Tournament")) return "Advanced";
  return "Beginner";
}

export default function FreeTrialCTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "10", // Default age since it's required by the schema
    level: "Beginner (< 800 ELO)",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    // Fetch settings for WhatsApp number
    const fetchSettings = async () => {
      try {
        const settings = await apiRequest<any>('/api/settings');
        if (settings && settings.whatsapp) {
          setWhatsappNumber(settings.whatsapp);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  const openWhatsApp = () => {
    if (!whatsappNumber) return;
    
    const message = `Hello BrainSeekers Chess Academy,

I would like to book a FREE Trial Chess Class.

Name: ${formData.name}
Mobile Number: ${formData.mobile}
Age: ${formData.age}
Chess Experience: ${mapLevel(formData.level)}

Please share available batches, timings, and trial class schedule.

Thank You.`;

    const encodedMessage = encodeURIComponent(message);
    const numericWhatsapp = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${numericWhatsapp}?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.mobile) return;

    setSubmitting(true);
    try {
      await createLeadPublic({
        studentName: formData.name,
        age: parseInt(formData.age, 10) || 10,
        chessLevel: mapLevel(formData.level),
        parentName: `Guardian of ${formData.name}`,
        parentMobile: formData.mobile,
        parentEmail: formData.email,
        city: "Pending",
        address: "To be confirmed",
        studentMobile: formData.mobile,
        learningGoal: "Free evaluation session",
      });
      setSubmitted(true);

      if (whatsappNumber) {
        openWhatsApp();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit. Try the full registration form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="trial" className="py-14 md:py-24 relative overflow-hidden bg-navy-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-royal-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl md:rounded-3xl p-5 md:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-500/10 border border-royal-500/20 text-xs font-semibold text-royal-400">
              <Calendar className="w-3.5 h-3.5" />
              Limited Slots Available
            </span>
            <h2 className="font-display text-2xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Book Your Free Live Evaluation Session
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Meet 1-on-1 with a FIDE master. We evaluate tactical vision, establish an ELO baseline, and outline a training plan.
            </p>
            <Link href="/trial-class" className="text-sm font-bold text-royal-400 hover:text-royal-300 inline-flex items-center gap-1">
              Prefer the full registration form?
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-6 bg-slate-950/40 border border-white/5 rounded-2xl p-6 md:p-8 relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-mono font-bold uppercase text-slate-400">
                        Student Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="age" className="text-xs font-mono font-bold uppercase text-slate-400">
                        Age *
                      </label>
                      <input
                        id="age"
                        type="number"
                        min={4}
                        max={99}
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="mobile" className="text-xs font-mono font-bold uppercase text-slate-400">
                        Mobile Number *
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-mono font-bold uppercase text-slate-400">
                        Parent Email (Optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="level" className="text-xs font-mono font-bold uppercase text-slate-400 block">
                      Chess Level
                    </label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white cursor-pointer"
                    >
                      <option>Beginner (&lt; 800 ELO)</option>
                      <option>Intermediate (800 - 1200 ELO)</option>
                      <option>Advanced (1200 - 1600 ELO)</option>
                      <option>Tournament Player (&gt; 1600 ELO)</option>
                    </select>
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-royal-600 to-royal-500 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : whatsappNumber ? "Continue to WhatsApp" : "Confirm Booking Invitation"}
                      {!submitting && whatsappNumber ? <MessageCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                    {whatsappNumber && (
                      <p className="text-center text-xs text-slate-500 mt-3">
                        You will be redirected to WhatsApp to confirm your trial slot.
                      </p>
                    )}
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-white">Request Received!</h3>
                  <p className="text-slate-400 text-sm">
                    {whatsappNumber 
                      ? "If WhatsApp didn't open automatically, you can open it here:" 
                      : formData.email 
                        ? `We will contact you at ${formData.email} shortly.` 
                        : "We will contact you shortly."}
                  </p>
                  
                  {whatsappNumber ? (
                    <button
                      onClick={openWhatsApp}
                      className="w-full px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors mt-4"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Open WhatsApp Again
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 border border-white/5 inline-flex items-center gap-2 text-xs text-royal-400 font-semibold font-mono">
                      <Award className="w-4 h-4" />
                      Saved to academy pipeline
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
