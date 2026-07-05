"use client";

import { useEffect, useState } from "react";
import { fetchAttendanceByStudent, type ApiAttendance } from "@/lib/attendance";
import { fetchParentChildren, type ApiStudent } from "@/lib/students";
import { Loader2 } from "lucide-react";

export default function ParentAttendancePage() {
  const [children, setChildren] = useState<ApiStudent[]>([]);
  const [selected, setSelected] = useState("");
  const [records, setRecords] = useState<ApiAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentChildren()
      .then((all) => {
        setChildren(all);
        if (all[0]) setSelected(all[0]._id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetchAttendanceByStudent(selected).then(setRecords).catch(() => setRecords([]));
  }, [selected]);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Child Attendance</h1>
      {children.length > 1 && (
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
        >
          {children.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r._id} className="glass-panel p-4 rounded-xl flex justify-between">
              <span>{new Date(r.date).toLocaleDateString()}</span>
              <span className="font-mono text-xs text-royal-400">{r.status}</span>
            </div>
          ))}
          {records.length === 0 && <p className="text-slate-500 text-sm">No records for this child.</p>}
        </div>
      )}
    </div>
  );
}
