"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowLeft, CheckCircle, MessageCircle } from "lucide-react";
import { createLeadPublic } from "@/lib/leads";
import { apiRequest } from "@/lib/api";
import { ChessLevel } from "@/types/academy";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FALLBACK_WHATSAPP = "918485079048";

export default function TrialClassPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    mobile: "",
    age: "",
    chessLevel: "Beginner" as ChessLevel,
    email: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(FALLBACK_WHATSAPP);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await apiRequest<any>('/api/settings');
        if (settings && settings.whatsapp) {
          setWhatsappNumber(settings.whatsapp);
        }
      } catch (err) {
        // Settings fetch failed — fallback number is already set
      }
    };
    fetchSettings();
  }, []);

  const buildWhatsAppUrl = () => {
    const message = `Hello BrainSeekers Chess Academy! ♟️

I want to book a free trial class. Here are my details:

👤 Student Name: ${formData.studentName}
📱 Mobile Number: ${formData.mobile}
🎂 Age: ${formData.age}
🎯 Chess Level: ${formData.chessLevel}${formData.email ? `\n📧 Email: ${formData.email}` : ""}${formData.notes ? `\n📝 Additional Notes: ${formData.notes}` : ""}

Please share available trial class timings and batch details.

Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const numericWhatsapp = whatsappNumber.replace(/\D/g, '') || FALLBACK_WHATSAPP;
    return `https://wa.me/${numericWhatsapp}?text=${encodedMessage}`;
  };

  const openWhatsApp = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentName || !formData.age || !formData.mobile) {
      return;
    }

    setSubmitting(true);

    // Open WhatsApp immediately — this is the primary action
    openWhatsApp();
    setSubmitted(true);

    // Try to save lead in background (non-blocking, fire-and-forget)
    try {
      await createLeadPublic({
        studentName: formData.studentName,
        age: parseInt(formData.age, 10) || 8,
        chessLevel: formData.chessLevel,
        parentName: `Guardian of ${formData.studentName}`,
        parentMobile: formData.mobile,
        parentEmail: formData.email,
        city: "Pending",
        address: "To be confirmed",
        studentMobile: formData.mobile,
        learningGoal: formData.notes || "Free trial class request",
      });
    } catch {
      // Backend save failed silently — WhatsApp already opened
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-950 text-slate-100 pt-28 pb-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-royal-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-royal-500/10 blur-[150px] pointer-events-none" />

        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8 uppercase font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to homepage
          </Link>

          <div className="glass-panel rounded-3xl p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="space-y-4 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-500/10 border border-royal-500/20 text-xs font-semibold text-royal-400">
                      <Calendar className="w-3.5 h-3.5" />
                      Free Trial Session
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      Trial Class Registration
                    </h1>
                    <p className="text-slate-400 text-sm max-w-xl">
                      Submit your details to book a complimentary 1-on-1 diagnostics call with our coaches.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Student Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Age *</label>
                        <input
                          type="number"
                          required
                          min={4}
                          max={99}
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Email (Optional)</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 block">Chess Experience Level *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["Beginner", "Intermediate", "Advanced"] as ChessLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setFormData({ ...formData, chessLevel: lvl })}
                            className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              formData.chessLevel === lvl
                                ? "bg-royal-600 border-royal-500 text-white"
                                : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400">Additional Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500 resize-none"
                        placeholder="Tell us about any specific goals or previous experience..."
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
                      >
                        {submitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4" />
                            Send Message on WhatsApp
                          </>
                        )}
                      </button>
                      <p className="text-center text-xs text-slate-500 mt-3">
                        You will be redirected to WhatsApp to confirm your trial slot.
                      </p>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-8"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-display font-extrabold text-3xl text-white">Trial Request Submitted Successfully</h2>
                    <p className="text-slate-400 text-base max-w-md mx-auto">
                      If WhatsApp didn&apos;t open automatically, you can open it here:
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      onClick={openWhatsApp}
                      className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Open WhatsApp Again
                    </button>
                    <Link
                      href="/"
                      className="w-full sm:w-auto px-8 py-3 rounded-full bg-slate-900 border border-white/10 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
