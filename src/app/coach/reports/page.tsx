"use client";

import { useEffect, useState } from "react";
import { fetchReports, createReport } from "@/lib/reports";
import { fetchStudents } from "@/lib/students";
import { fetchCoachOptions } from "@/lib/coaches";
import type { ApiProgressReport } from "@/lib/reports";

export default function CoachReportsPage() {
  const [reports, setReports] = useState<ApiProgressReport[]>([]);
  const [students, setStudents] = useState<{ _id: string; name: string }[]>([]);
  const [coaches, setCoaches] = useState<{ id: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    student: "",
    coach: "",
    tacticalSkills: 7,
    openingKnowledge: 7,
    endgameSkills: 7,
    tournamentPerformance: 7,
    discipline: 7,
    remarks: "",
    rating: 1200,
  });

  useEffect(() => {
    Promise.all([fetchReports(), fetchStudents(), fetchCoachOptions()]).then(([r, s, c]) => {
      setReports(r);
      setStudents(s.map((x) => ({ _id: x._id, name: x.name })));
      setCoaches(c);
      if (s[0]) setForm((f) => ({ ...f, student: s[0]._id }));
      if (c[0]) setForm((f) => ({ ...f, coach: c[0].id }));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReport(form);
    setShowForm(false);
    setReports(await fetchReports());
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-display text-3xl font-extrabold text-white">Progress Reports</h1>
        <button type="button" onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl bg-royal-600 text-sm font-bold text-white">
          New Report
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-panel p-6 rounded-2xl grid md:grid-cols-2 gap-4">
          <select value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">
            {students.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          {(["tacticalSkills", "openingKnowledge", "endgameSkills", "tournamentPerformance", "discipline"] as const).map((key) => (
            <label key={key} className="text-xs text-slate-400">
              {key}
              <input type="number" min={0} max={10} value={form[key]} onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 text-white" />
            </label>
          ))}
          <input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-slate-900 text-white" placeholder="Rating" />
          <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="md:col-span-2 px-3 py-2 rounded-xl bg-slate-900 text-white min-h-[60px]" placeholder="Remarks" />
          <button type="submit" className="md:col-span-2 py-3 rounded-xl bg-royal-600 font-bold text-white">Save Report</button>
        </form>
      )}

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r._id} className="glass-panel p-5 rounded-xl">
            <p className="font-bold text-white">{typeof r.student === "object" ? r.student.name : "Student"}</p>
            <p className="text-xs text-slate-500 mt-1">Rating {r.rating} · Tactical {r.tacticalSkills}/10</p>
            <p className="text-sm text-slate-400 mt-2">{r.remarks}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
