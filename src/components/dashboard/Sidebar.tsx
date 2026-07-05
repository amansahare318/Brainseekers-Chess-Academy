"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Calendar,
  BookOpen,
  Settings,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Award,
  LogOut,
  Newspaper,
  Images,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettings } from "@/context/SettingsContext";

const roleLinks = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Leads Intake", href: "/admin/leads", icon: UserCheck },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Academy Batches", href: "/admin/batches", icon: Calendar },
    { name: "Attendance", href: "/admin/attendance", icon: Calendar },
    { name: "Assignments", href: "/admin/assignments", icon: CheckSquare },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Progress Reports", href: "/admin/reports", icon: FileText },
    { name: "Blog", href: "/admin/blog", icon: Newspaper },
    { name: "Gallery", href: "/admin/gallery", icon: Images },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  coach: [
    { name: "Dashboard", href: "/coach/dashboard", icon: LayoutDashboard },
    { name: "Attendance", href: "/coach/attendance", icon: Calendar },
    { name: "Assignments", href: "/coach/assignments", icon: CheckSquare },
    { name: "Progress Reports", href: "/coach/reports", icon: FileText },
    { name: "My Batches", href: "/coach/batches", icon: Users },
  ],
  student: [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Attendance", href: "/student/attendance", icon: Calendar },
    { name: "Assignments", href: "/student/assignments", icon: BookOpen },
    { name: "Progress Report", href: "/student/progress", icon: FileText },
    { name: "Certificates", href: "/student/certificates", icon: Award },
  ],
  parent: [
    { name: "Dashboard", href: "/parent/dashboard", icon: LayoutDashboard },
    { name: "Attendance", href: "/parent/attendance", icon: Calendar },
    { name: "Progress Tracking", href: "/parent/progress", icon: Award },
  ],
  public: [],
};

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const settings = useSettings();

  const currentRole = user?.role || "public";
  const links = roleLinks[currentRole as keyof typeof roleLinks] || [];
  const brandName = settings.academyName || "BrainSeekers";
  const logoSrc = settings.logo?.url || "/logo.png";

  return (
    <aside className="w-64 h-full bg-navy-900 border-r border-white/5 flex flex-col justify-between py-6 px-4">
      <div className="space-y-8 flex-1 overflow-y-auto min-h-0 pr-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="relative w-10 h-10">
            <Image src={logoSrc} alt={`${brandName} Logo`} fill sizes="40px" className="object-contain" unoptimized={!!settings.logo?.url} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base text-white tracking-tight leading-none truncate max-w-[140px]">
              {brandName}
            </span>
            <span className="text-[7px] text-slate-400 mt-1 uppercase font-semibold truncate max-w-[140px]">
              {settings.tagline || "Master the Game."}
            </span>
          </div>
        </Link>

        <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Logged In As</span>
            <span className="text-sm font-semibold text-royal-400 capitalize">{user?.name || currentRole}</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" />
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-royal-600 text-white font-bold shadow-lg shadow-royal-600/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-royal-400"}`} />
                  <span>{link.name}</span>
                </div>
                {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 mt-4 border-t border-white/5">
        <Link
          href="/login"
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/15 transition-all group cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-400" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
