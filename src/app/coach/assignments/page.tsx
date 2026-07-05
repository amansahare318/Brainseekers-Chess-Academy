"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { fetchAssignments, createAssignment, deleteAssignment } from "@/lib/assignments";
import { fetchBatches } from "@/lib/batches";
import { fetchCoachOptions } from "@/lib/coaches";
import type { ApiAssignment } from "@/lib/assignments";

export default function CoachAssignmentsPage() {
  const [list, setList] = useState<ApiAssignment[]>([]);
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    coach: "",
    batch: "",
    dueDate: "",
    attachmentName: "",
    attachmentUrl: "",
  });

  const load = () =>
    fetchAssignments()
      .then(setList)
      .finally(() => setLoading(false));

  useEffect(() => {
    Promise.all([load(), fetchBatches(), fetchCoachOptions()]).then(([, b, c]) => {
      setBatches(b.map((x) => ({ id: x._id, name: x.name })));
      setCoaches(c);
      if (c[0]) setForm((f) => ({ ...f, coach: c[0].id }));
      if (b[0]) setForm((f) => ({ ...f, batch: b[0]._id }));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssignment({
      title: form.title,
      description: form.description,
      coach: form.coach,
      batch: form.batch,
      dueDate: form.dueDate,
      attachments: form.attachmentUrl
        ? [{ name: form.attachmentName || "Resource", url: form.attachmentUrl }]
        : [],
    });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-extrabold text-white">Assignments</h1>
        <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 text-sm font-bold text-white">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-panel p-6 rounded-2xl space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm" />
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm min-h-[80px]" />
          <select required value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm">
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input type="datetime-local" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm" />
          <input placeholder="Attachment URL (optional)" value={form.attachmentUrl} onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm" />
          <button type="submit" className="w-full py-3 rounded-xl bg-royal-600 font-bold text-white">Create</button>
        </form>
      )}

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a._id} className="glass-panel p-5 rounded-xl flex justify-between gap-4">
              <div>
                <h3 className="font-bold text-white">{a.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Due {new Date(a.dueDate).toLocaleString()}</p>
              </div>
              <button type="button" onClick={() => deleteAssignment(a._id).then(load)} className="text-red-400 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
