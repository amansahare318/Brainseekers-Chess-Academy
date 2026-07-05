"use client";

import { useEffect, useState } from "react";
import { UserCheck, Users, Calendar, Trophy, ArrowRight, Loader2, CheckSquare, FileText, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchLeads } from "@/lib/leads";
import { fetchAdminDashboardStats } from "@/lib/dashboard";
import type { Lead } from "@/types/academy";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchAdminDashboardStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLeads(), fetchAdminDashboardStats()])
      .then(([leadData, dash]) => {
        setLeads(leadData);
        setStats(dash);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { name: "Active Leads", value: stats.leads, icon: UserCheck, color: "text-blue-400 bg-blue-950/40 border-blue-500/20" },
        { name: "Students", value: stats.students, icon: Users, color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20" },
        { name: "Batches", value: stats.batches, icon: Calendar, color: "text-amber-400 bg-amber-950/40 border-amber-500/20" },
        { name: "Assignments", value: stats.assignments, icon: CheckSquare, color: "text-purple-400 bg-purple-950/40 border-purple-500/20" },
        { name: "Reports", value: stats.reports, icon: FileText, color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20" },
        { name: "Certificates", value: stats.certificates, icon: Award, color: "text-royal-400 bg-royal-950/40 border-royal-500/20" },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Academy Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Live metrics from MongoDB across all academy modules.</p>
      </div>

      {loading ? (
        <div className="flex gap-2 text-slate-500 py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl flex items-center justify-between"
              >
                <div className="space-y-2">
                  <span className="text-xs text-slate-500 font-semibold font-mono uppercase tracking-wider">{item.name}</span>
                  <h3 className="font-display text-3xl font-black text-white">{item.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display font-bold text-lg text-white">Incoming Leads</h2>
            <Link href="/admin/leads" className="text-xs font-bold text-royal-400 hover:text-royal-300 flex items-center gap-1">
              Go to pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {leads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{lead.studentName}</h4>
                  <p className="text-xs text-slate-500 mt-1">{lead.chessLevel} · {lead.parentName}</p>
                </div>
                <span className="text-[10px] font-mono text-royal-400">{lead.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl">
          <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4 mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/admin/attendance" className="text-royal-400 hover:underline">Attendance reports</Link></li>
            <li><Link href="/admin/assignments" className="text-royal-400 hover:underline">Assignment activity</Link></li>
            <li><Link href="/admin/certificates" className="text-royal-400 hover:underline">Issue certificates</Link></li>
          </ul>
          {stats && (
            <p className="text-xs text-slate-500 mt-6">Present marks this month: {stats.attendancePresentMonth}</p>
          )}
        </div>
      </div>
    </div>
  );
}
