"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchParentChildren } from "@/lib/students";
import { fetchReports } from "@/lib/reports";
import { fetchAttendanceByStudent } from "@/lib/attendance";

export default function ParentDashboardPage() {
  const [childCount, setChildCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [attendanceAvg, setAttendanceAvg] = useState("—");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const children = await fetchParentChildren();
        setChildCount(children.length);
        const reports = await fetchReports();
        setReportCount(reports.length);
        if (children[0]) {
          const att = await fetchAttendanceByStudent(children[0]._id).catch(() => []);
          const present = att.filter((a) => a.status === "Present").length;
          setAttendanceAvg(att.length ? `${Math.round((present / att.length) * 100)}%` : "—");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Parent Portal</h1>
        <p className="text-sm text-slate-400 mt-1">Overview of your child&apos;s academy activity.</p>
      </div>

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <Users className="w-5 h-5 text-royal-400 mb-2" />
            <p className="text-xs text-slate-500 font-mono uppercase">Linked Children</p>
            <p className="text-2xl font-black text-white">{childCount}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <Calendar className="w-5 h-5 text-amber-400 mb-2" />
            <p className="text-xs text-slate-500 font-mono uppercase">Attendance</p>
            <p className="text-2xl font-black text-white">{attendanceAvg}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <FileText className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-xs text-slate-500 font-mono uppercase">Coach Reports</p>
            <p className="text-2xl font-black text-white">{reportCount}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 text-sm">
        <Link href="/parent/attendance" className="text-royal-400 font-bold">View attendance →</Link>
        <Link href="/parent/progress" className="text-royal-400 font-bold">View progress →</Link>
      </div>
    </div>
  );
}
