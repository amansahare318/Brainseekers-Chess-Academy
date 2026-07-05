"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Loader2, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import {
  fetchBatches,
  fetchBatchDetail,
  createBatch,
  updateBatch,
  deleteBatch,
  assignBatchStudents,
  type ApiBatch,
} from "@/lib/batches";
import { fetchCoachOptions, type CoachOption } from "@/lib/coaches";
import { fetchStudents, type ApiStudent } from "@/lib/students";
import { ApiError } from "@/lib/api";

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<ApiBatch[]>([]);
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [allStudents, setAllStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | "assign" | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    schedule: "",
    startDate: "",
    endDate: "",
    coach: "",
  });
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [batchData, coachData, studentData] = await Promise.all([
        fetchBatches(),
        fetchCoachOptions().catch(() => []),
        fetchStudents().catch(() => []),
      ]);
      setBatches(batchData);
      setCoaches(coachData);
      setAllStudents(studentData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load batches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({ name: "", schedule: "", startDate: "", endDate: "", coach: "" });
    setModal("create");
    setActiveId(null);
  };

  const openEdit = (batch: ApiBatch) => {
    setForm({
      name: batch.name,
      schedule: batch.schedule || "",
      startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
      endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
      coach: typeof batch.coach === "object" && batch.coach ? batch.coach._id : String(batch.coach || ""),
    });
    setActiveId(batch._id);
    setModal("edit");
  };

  const openAssign = async (id: string) => {
    setActiveId(id);
    setError("");
    try {
      const detail = await fetchBatchDetail(id);
      setSelectedStudentIds(detail.students.map((s) => s._id));
      setModal("assign");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load batch students");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name,
        schedule: form.schedule || undefined,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        coach: form.coach || undefined,
      };
      if (modal === "create") {
        await createBatch(body);
      } else if (modal === "edit" && activeId) {
        await updateBatch(activeId, body);
      }
      setModal(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this batch? Students will be unassigned.")) return;
    try {
      await deleteBatch(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  const handleAssign = async () => {
    if (!activeId) return;
    setSaving(true);
    try {
      await assignBatchStudents(activeId, selectedStudentIds);
      setModal(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Assign failed");
    } finally {
      setSaving(false);
    }
  };

  const coachName = (batch: ApiBatch) => {
    if (batch.coach && typeof batch.coach === "object") return batch.coach.name;
    return "—";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Academy Batches</h1>
          <p className="text-sm text-slate-400 mt-1">Create batches, assign coaches and students.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 text-sm font-bold text-white"
        >
          <Plus className="w-4 h-4" />
          New Batch
        </button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-sm text-red-300">{error}</div>}

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </div>
        ) : batches.length === 0 ? (
          <p className="text-center py-16 text-slate-500 text-sm">No batches yet. Create your first batch.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-mono uppercase text-slate-500 border-b border-white/5">
                <tr>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Coach</th>
                  <th className="py-4 px-6">Students</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-slate-900/30">
                    <td className="py-4 px-6 font-bold text-white">{batch.name}</td>
                    <td className="py-4 px-6">{batch.schedule || "—"}</td>
                    <td className="py-4 px-6">{coachName(batch)}</td>
                    <td className="py-4 px-6">{batch.studentCount ?? 0}</td>
                    <td className="py-4 px-6 text-right space-x-1">
                      <button type="button" onClick={() => openAssign(batch._id)} className="p-2 rounded-lg hover:bg-slate-800 text-royal-400 cursor-pointer" title="Assign students">
                        <Users className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => openEdit(batch)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(batch._id)} className="p-2 rounded-lg hover:bg-red-950/40 text-red-400 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative z-10 glass-panel rounded-3xl p-8 max-w-md w-full space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-white">{modal === "create" ? "Create Batch" : "Edit Batch"}</h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                required
                placeholder="Batch name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
              />
              <input
                placeholder="Schedule (e.g. Sat & Sun 10 AM)"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
              />
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
              />
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
              />
              <select
                value={form.coach}
                onChange={(e) => setForm({ ...form, coach: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white cursor-pointer"
              >
                <option value="">— No coach —</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-royal-600 font-bold text-white disabled:opacity-60">
                {saving ? "Saving..." : "Save Batch"}
              </button>
            </form>
          </div>
        </div>
      )}

      {modal === "assign" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative z-10 glass-panel rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-royal-400" />
                Assign Students
              </h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {allStudents.length === 0 ? (
              <p className="text-sm text-slate-500">No students in the system. Convert a lead first.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allStudents.map((s) => (
                  <label key={s._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(s._id)}
                      onChange={(e) => {
                        setSelectedStudentIds((prev) =>
                          e.target.checked ? [...prev, s._id] : prev.filter((id) => id !== s._id)
                        );
                      }}
                    />
                    <span className="text-sm text-white font-medium">{s.name}</span>
                    <span className="text-xs text-slate-500 font-mono ml-auto">{s.studentId}</span>
                  </label>
                ))}
              </div>
            )}
            <button type="button" onClick={handleAssign} disabled={saving} className="w-full py-3 rounded-xl bg-royal-600 font-bold text-white disabled:opacity-60">
              {saving ? "Saving..." : "Save Assignments"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
