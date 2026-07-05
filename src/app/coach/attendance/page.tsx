"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchCoachAttendanceContext,
  bulkAttendance,
  fetchAttendanceByBatch,
  updateAttendance,
  type AttendanceStatus,
} from "@/lib/attendance";

export default function CoachAttendancePage() {
  const [batches, setBatches] = useState<{ _id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ _id: string; studentId: string; name: string; batch?: string }[]>([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [existing, setExisting] = useState<Record<string, string>>({});
  const [coachId, setCoachId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoachAttendanceContext().then((ctx) => {
      setBatches(ctx.batches);
      setStudents(ctx.students);
      setCoachId(ctx.coachId || "");
      if (ctx.batches[0]) setBatchId(ctx.batches[0]._id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!batchId || !date) return;
    fetchAttendanceByBatch(batchId, date).then((list) => {
      const m: Record<string, AttendanceStatus> = {};
      const ex: Record<string, string> = {};
      list.forEach((r) => {
        const sid = typeof r.student === "object" ? r.student._id : String(r.student);
        m[sid] = r.status;
        ex[sid] = r._id;
        if (typeof r.coach === "object" && r.coach._id) setCoachId(r.coach._id);
      });
      setMarks(m);
      setExisting(ex);
    });
  }, [batchId, date]);

  const batchStudents = students.filter((s) => String(s.batch) === batchId);

  const saveAll = async () => {
    if (!batchId || !coachId) {
      alert("Select a batch with an assigned coach.");
      return;
    }
    setSaving(true);
    try {
      const records = batchStudents.map((s) => ({
        student: s._id,
        batch: batchId,
        coach: coachId,
        date,
        status: marks[s._id] || "Present",
      }));
      await bulkAttendance(records);
      alert("Attendance saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Mark Attendance</h1>

      <div className="flex flex-wrap gap-4">
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
        >
          {batches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
        />
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="px-6 py-2 rounded-xl bg-royal-600 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="glass-panel rounded-2xl divide-y divide-white/5">
        {batchStudents.length === 0 ? (
          <p className="p-8 text-slate-500 text-sm text-center">No students in this batch.</p>
        ) : (
          batchStudents.map((s) => (
            <div key={s._id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white">{s.name}</p>
                <p className="text-xs text-slate-500 font-mono">{s.studentId}</p>
              </div>
              <select
                value={marks[s._id] || "Present"}
                onChange={async (e) => {
                  const status = e.target.value as AttendanceStatus;
                  setMarks((prev) => ({ ...prev, [s._id]: status }));
                  if (existing[s._id]) {
                    await updateAttendance(existing[s._id], { status });
                  }
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
