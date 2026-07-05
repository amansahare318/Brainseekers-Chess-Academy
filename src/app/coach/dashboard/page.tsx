"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, Calendar, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchBatches } from "@/lib/batches";
import { fetchAssignments } from "@/lib/assignments";
import { fetchReports } from "@/lib/reports";
import { fetchCoachMe } from "@/lib/coaches";

export default function CoachDashboardPage() {
  const [coachName, setCoachName] = useState("");
  const [batches, setBatches] = useState(0);
  const [students, setStudents] = useState(0);
  const [assignments, setAssignments] = useState(0);
  const [reports, setReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [linkWarning, setLinkWarning] = useState("");

  useEffect(() => {
    Promise.all([
      fetchCoachMe().catch(() => null),
      fetchBatches(),
      fetchAssignments(),
      fetchReports(),
    ])
      .then(([me, b, a, r]) => {
        if (me) {
          setCoachName(me.coach.name);
        } else {
          setLinkWarning("No coach profile linked to your account. Contact admin.");
        }
        setBatches(b.length);
        setStudents(b.reduce((s, x) => s + (x.studentCount || 0), 0));
        setAssignments(a.length);
        setReports(r.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { name: "My Batches", value: batches, icon: Calendar },
    { name: "Students", value: students, icon: Users },
    { name: "Assignments", value: assignments, icon: BookOpen },
    { name: "Reports", value: reports, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">
          {coachName ? `Welcome, ${coachName}` : "Coach Dashboard"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Your batches, assignments, and reports (filtered to your profile).</p>
        {linkWarning && <p className="text-amber-400 text-sm mt-2">{linkWarning}</p>}
      </div>

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="glass-panel p-5 rounded-2xl">
                <Icon className="w-5 h-5 text-royal-400 mb-2" />
                <p className="text-xs text-slate-500 font-mono uppercase">{s.name}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/coach/attendance" className="text-royal-400 font-bold hover:underline">
          Mark attendance →
        </Link>
        <Link href="/coach/assignments" className="text-royal-400 font-bold hover:underline">
          Manage assignments →
        </Link>
        <Link href="/coach/reports" className="text-royal-400 font-bold hover:underline">
          Write progress report →
        </Link>
      </div>
    </div>
  );
}
