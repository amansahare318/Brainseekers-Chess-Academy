"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/lib/api";

const roleDashboard: Record<string, string> = {
  admin: "/admin/dashboard",
  coach: "/coach/dashboard",
  student: "/student/dashboard",
  parent: "/parent/dashboard",
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      const dest = user ? roleDashboard[user.role] || "/login" : "/login";
      router.replace(dest);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update password.");
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl space-y-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-royal-600/20 flex items-center justify-center text-royal-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Change Password</h1>
          <p className="text-sm text-slate-400">
            You signed in with a temporary password. Set a new password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Current / Temporary Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-royal-600 hover:bg-royal-500 text-sm font-bold text-white disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
