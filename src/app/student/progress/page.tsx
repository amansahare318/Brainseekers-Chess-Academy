"use client";

import { useEffect, useState } from "react";
import { fetchReports, type ApiProgressReport } from "@/lib/reports";
import { useAuthStore } from "@/store/useAuthStore";

export default function StudentProgressPage() {
  const profileRef = useAuthStore((s) => s.user?.profileRef);
  const [reports, setReports] = useState<ApiProgressReport[]>([]);

  useEffect(() => {
    if (profileRef) fetchReports().then(setReports);
  }, [profileRef]);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Progress Reports</h1>
      {reports.length === 0 ? (
        <p className="text-slate-500 text-sm">No reports published yet.</p>
      ) : (
        reports.map((r) => (
          <div key={r._id} className="glass-panel p-6 rounded-2xl space-y-3">
            <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span className="text-slate-500">Tactical</span><p className="text-white font-bold">{r.tacticalSkills}/10</p></div>
              <div><span className="text-slate-500">Opening</span><p className="text-white font-bold">{r.openingKnowledge}/10</p></div>
              <div><span className="text-slate-500">Endgame</span><p className="text-white font-bold">{r.endgameSkills}/10</p></div>
              <div><span className="text-slate-500">Tournament</span><p className="text-white font-bold">{r.tournamentPerformance}/10</p></div>
              <div><span className="text-slate-500">Discipline</span><p className="text-white font-bold">{r.discipline}/10</p></div>
              <div><span className="text-slate-500">Rating</span><p className="text-white font-bold">{r.rating}</p></div>
            </div>
            <p className="text-slate-300 text-sm">{r.remarks}</p>
          </div>
        ))
      )}
    </div>
  );
}
