"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/auth";
import { ApiError } from "@/lib/api";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      router.replace("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!tokenFromUrl && (
        <input
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Reset token from email"
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
        />
      )}
      <input
        type="password"
        required
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
      />
      <input
        type="password"
        required
        minLength={8}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl space-y-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-royal-600/20 flex items-center justify-center text-royal-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Reset Password</h1>
        </div>
        <Suspense fallback={<p className="text-slate-500 text-sm">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
