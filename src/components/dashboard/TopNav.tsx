"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, User, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";

export default function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const currentRole = user?.role || "public";

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    return { label, href };
  });

  return (
    <>
      <header className="h-16 border-b border-white/5 bg-navy-950 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 font-mono">
            <span className="text-slate-400 uppercase">{currentRole}</span>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  {isLast ? (
                    <span className="text-royal-400 uppercase font-bold">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-slate-300 transition-colors uppercase">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-royal-500 ring-2 ring-navy-950" />
          </button>

          <div className="flex items-center gap-2.5 border-l border-white/5 pl-4">
            <div className="w-9 h-9 rounded-full bg-royal-950/80 border border-royal-500/20 flex items-center justify-center text-royal-400">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">{user?.name || "Session Active"}</span>
              <span className="text-[10px] text-slate-500 capitalize mt-1 font-semibold">{currentRole} portal</span>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
