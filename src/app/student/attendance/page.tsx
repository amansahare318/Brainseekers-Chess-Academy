"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchAttendanceByStudent, type ApiAttendance } from "@/lib/attendance";
import { useAuthStore } from "@/store/useAuthStore";

export default function StudentAttendancePage() {
  const profileRef = useAuthStore((s) => s.user?.profileRef);
  const [records, setRecords] = useState<ApiAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileRef) {
      setLoading(false);
      return;
    }
    fetchAttendanceByStudent(profileRef)
      .then(setRecords)
      .finally(() => setLoading(false));
  }, [profileRef]);

  const present = records.filter((r) => r.status === "Present").length;
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">My Attendance</h1>
      <div className="glass-panel p-6 rounded-2xl">
        <p className="text-xs text-slate-500 font-mono uppercase">Attendance Rate</p>
        <p className="text-3xl font-black text-white">{loading ? "—" : `${rate}%`}</p>
      </div>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r._id} className="glass-panel p-4 rounded-xl flex justify-between">
              <span className="text-white">{new Date(r.date).toLocaleDateString()}</span>
              <span className="text-xs font-mono text-royal-400">{r.status}</span>
            </div>
          ))}
          {records.length === 0 && <p className="text-slate-500 text-sm">No attendance records yet.</p>}
        </div>
      )}
    </div>
  );
}
