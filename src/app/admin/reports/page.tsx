"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchReports, type ApiProgressReport } from "@/lib/reports";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ApiProgressReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Progress Reports</h1>
        <p className="text-sm text-slate-400 mt-1">All academy progress reports from coaches.</p>
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs font-mono uppercase text-slate-500">
                <th className="py-3 px-6 text-left">Student</th>
                <th className="py-3 px-6 text-left">Coach</th>
                <th className="py-3 px-6 text-left">Rating</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    No reports yet
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r._id}>
                    <td className="py-3 px-6 text-white font-semibold">
                      {typeof r.student === "object" ? r.student?.name : r.student}
                    </td>
                    <td className="py-3 px-6 text-slate-400">
                      {typeof r.coach === "object" ? r.coach?.name : r.coach}
                    </td>
                    <td className="py-3 px-6 font-mono text-royal-400">{r.rating}</td>
                    <td className="py-3 px-6 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
