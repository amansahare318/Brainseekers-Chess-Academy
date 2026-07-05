"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, BookOpen, User, Users, ArrowLeft, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/lib/api";
import type { SessionRole } from "@/types/academy";

type Portal = {
  role: SessionRole;
  title: string;
  description: string;
  icon: typeof Shield;
  redirect: string;
  loginType: "email" | "mobile";
};

const portals: Portal[] = [
  {
    role: "admin",
    title: "Admin Login",
    description: "Email and password for academy administrators.",
    icon: Shield,
    redirect: "/admin/dashboard",
    loginType: "email",
  },
  {
    role: "coach",
    title: "Coach Login",
    description: "Email and password for certified coaches.",
    icon: BookOpen,
    redirect: "/coach/dashboard",
    loginType: "email",
  },
  {
    role: "student",
    title: "Student Login",
    description: "Mobile number and password.",
    icon: User,
    redirect: "/student/dashboard",
    loginType: "mobile",
  },
  {
    role: "parent",
    title: "Parent Login",
    description: "Mobile number and password.",
    icon: Users,
    redirect: "/parent/dashboard",
    loginType: "mobile",
  },
];

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [activePortal, setActivePortal] = useState<Portal>(portals[0]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectParam = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({
        email: activePortal.loginType === "email" ? email : undefined,
        mobile: activePortal.loginType === "mobile" ? mobile : undefined,
        password,
        role: activePortal.role,
      });

      if (user.mustChangePassword) {
        router.replace("/login/change-password");
        return;
      }

      const dest =
        redirectParam && redirectParam.startsWith(`/${activePortal.role}`)
          ? redirectParam
          : activePortal.redirect;
      router.replace(dest);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Check your credentials.");
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 flex flex-col py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-royal-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="Logo" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-display font-bold text-lg text-white">BrainSeekers</span>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto my-10 grid lg:grid-cols-5 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="font-display text-3xl font-extrabold text-white">Academy Portal</h1>
          <p className="text-sm text-slate-400">
            Sign in with your role-specific credentials. Admin and coach use email; students and parents use mobile number.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {portals.map((p) => {
              const Icon = p.icon;
              const isActive = activePortal.role === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => {
                    setActivePortal(p);
                    setError("");
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "border-royal-500 bg-royal-600/10"
                      : "border-white/10 bg-slate-900/40 hover:border-white/20"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isActive ? "text-royal-400" : "text-slate-500"}`} />
                  <span className="text-xs font-bold text-white block">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={activePortal.role}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 glass-panel rounded-3xl p-8"
        >
          <div className="space-y-2 mb-8">
            <h2 className="font-display text-2xl font-bold text-white">{activePortal.title}</h2>
            <p className="text-sm text-slate-400">{activePortal.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {activePortal.loginType === "email" ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brainseekers.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Mobile Number</label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 5550199"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-royal-500"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="text-right">
              <Link href={`/login/forgot-password`} className="text-xs text-royal-400 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-royal-600 hover:bg-royal-500 text-sm font-bold text-white disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>

      <div className="text-center text-xs text-slate-600 font-mono relative z-10">
        BrainSeekers Chess Academy &copy; {new Date().getFullYear()}
      </div>
    </main>
  );
}
