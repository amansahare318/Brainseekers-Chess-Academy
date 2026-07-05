"use client";

import { useEffect, useState } from "react";
import { fetchReports, type ApiProgressReport } from "@/lib/reports";
import { fetchParentChildren, type ApiStudent } from "@/lib/students";

export default function ParentProgressPage() {
  const [children, setChildren] = useState<ApiStudent[]>([]);
  const [selected, setSelected] = useState("");
  const [reports, setReports] = useState<ApiProgressReport[]>([]);

  useEffect(() => {
    fetchParentChildren().then((c) => {
      setChildren(c);
      if (c[0]) setSelected(c[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selected) fetchReports(selected).then(setReports);
  }, [selected]);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Child Progress</h1>
      {children.length > 1 && (
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm">
          {children.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      )}
      {reports.map((r) => (
        <div key={r._id} className="glass-panel p-6 rounded-2xl">
          <p className="font-bold text-white">Rating {r.rating}</p>
          <p className="text-sm text-slate-400 mt-2">{r.remarks}</p>
        </div>
      ))}
      {reports.length === 0 && <p className="text-slate-500 text-sm">No reports yet.</p>}
    </div>
  );
}
