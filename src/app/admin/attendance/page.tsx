"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchAttendance, fetchAttendanceStats, type ApiAttendance } from "@/lib/attendance";

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<ApiAttendance[]>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchAttendanceStats>> | null>(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    (async () => {
      try {
        const [list, st] = await Promise.all([
          fetchAttendance({ month: now.getMonth() + 1, year: now.getFullYear() }),
          fetchAttendanceStats(now.getMonth() + 1, now.getFullYear()),
        ]);
        setRecords(list);
        setStats(st);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Attendance Reports</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.totals.map((t) => (
            <div key={t._id} className="glass-panel p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-mono uppercase">{t._id}</p>
              <p className="text-2xl font-black text-white">{t.count}</p>
            </div>
          ))}
          <div className="glass-panel p-4 rounded-xl">
            <p className="text-xs text-slate-500 font-mono uppercase">Students</p>
            <p className="text-2xl font-black text-white">{stats.totalStudents}</p>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Batch</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {records.map((r) => (
              <tr key={r._id}>
                <td className="py-3 px-4">{new Date(r.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{typeof r.student === "object" ? r.student.name : "—"}</td>
                <td className="py-3 px-4">{typeof r.batch === "object" ? r.batch.name : "—"}</td>
                <td className="py-3 px-4 font-mono text-xs">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <p className="text-center py-8 text-slate-500">No attendance this month.</p>}
      </div>
    </div>
  );
}
