"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { forgotPassword } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { SessionRole } from "@/types/academy";

const roles: { value: SessionRole; label: string; type: "email" | "mobile" }[] = [
  { value: "admin", label: "Admin", type: "email" },
  { value: "coach", label: "Coach", type: "email" },
  { value: "student", label: "Student", type: "mobile" },
  { value: "parent", label: "Parent", type: "mobile" },
];

export default function ForgotPasswordPage() {
  const [role, setRole] = useState<SessionRole>("admin");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const portal = roles.find((r) => r.value === role)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevLink("");
    setLoading(true);
    try {
      const result = await forgotPassword({
        role,
        email: portal.type === "email" ? email : undefined,
        mobile: portal.type === "mobile" ? mobile : undefined,
      });
      setMessage(result.message);
      if (result.resetUrl) setDevLink(result.resetUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl space-y-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-royal-600/20 flex items-center justify-center text-royal-400">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-sm text-slate-400">We will send a reset link if your account exists.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as SessionRole)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {portal.type === "email" ? (
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
            />
          ) : (
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile number"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
            />
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}
          {devLink && (
            <p className="text-xs text-amber-400 break-all">
              Dev reset link:{" "}
              <Link href={devLink.replace(/^https?:\/\/[^/]+/, "")} className="underline">
                open reset page
              </Link>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </main>
  );
}
