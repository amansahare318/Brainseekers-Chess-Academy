"use client";

import { useEffect, useState } from "react";
import { fetchAssignments, submitAssignment, type ApiAssignment } from "@/lib/assignments";
import { Loader2 } from "lucide-react";

export default function StudentAssignmentsPage() {
  const [list, setList] = useState<ApiAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAssignments()
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (id: string) => {
    const content = answers[id];
    if (!content?.trim()) return;
    setSubmitting(id);
    try {
      await submitAssignment({ assignmentId: id, content });
      const updated = await fetchAssignments();
      setList(updated);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">My Assignments</h1>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : list.length === 0 ? (
        <p className="text-slate-500 text-sm">No assignments for your batch yet.</p>
      ) : (
        list.map((a) => (
          <div key={a._id} className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-bold text-white">{a.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{a.description}</p>
              <p className="text-xs text-amber-400 mt-2">Due {new Date(a.dueDate).toLocaleString()}</p>
            </div>
            {a.attachments?.map((att) => (
              <a key={att.url} href={att.url} target="_blank" rel="noreferrer" className="text-xs text-royal-400 underline">
                {att.name}
              </a>
            ))}
            {a.submission ? (
              <p className="text-sm text-emerald-400">Submitted {new Date(a.submission.submittedAt).toLocaleString()}</p>
            ) : (
              <>
                <textarea
                  placeholder="Your submission..."
                  value={answers[a._id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [a._id]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white min-h-[100px]"
                />
                <button
                  type="button"
                  disabled={submitting === a._id}
                  onClick={() => handleSubmit(a._id)}
                  className="px-4 py-2 rounded-xl bg-royal-600 text-sm font-bold text-white disabled:opacity-60"
                >
                  {submitting === a._id ? "Submitting..." : "Submit"}
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
