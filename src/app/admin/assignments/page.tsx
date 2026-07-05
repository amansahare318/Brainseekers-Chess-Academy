"use client";

import { useEffect, useState } from "react";
import { fetchAssignments, type ApiAssignment } from "@/lib/assignments";
import { Loader2 } from "lucide-react";

export default function AdminAssignmentsPage() {
  const [list, setList] = useState<ApiAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments()
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Assignment Activity</h1>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a._id} className="glass-panel p-5 rounded-xl flex justify-between">
              <div>
                <h3 className="font-bold text-white">{a.title}</h3>
                <p className="text-xs text-slate-500">Due {new Date(a.dueDate).toLocaleDateString()}</p>
              </div>
              <span className="text-sm font-mono text-royal-400">{a.submissionCount ?? 0} submissions</span>
            </div>
          ))}
          {list.length === 0 && <p className="text-slate-500 text-sm">No assignments yet.</p>}
        </div>
      )}
    </div>
  );
}
