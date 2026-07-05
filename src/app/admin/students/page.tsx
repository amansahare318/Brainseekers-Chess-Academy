"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Loader2, Pencil, Search, Trash2, Users, X } from "lucide-react";
import {
  fetchStudentsPaginated,
  updateStudent,
  deleteStudent,
  refId,
  type ApiStudent,
} from "@/lib/students";
import { fetchCoachOptions, type CoachOption } from "@/lib/coaches";
import { fetchBatchOptions, type BatchOption } from "@/lib/batches";
import { ApiError } from "@/lib/api";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Tournament"];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [batchId, setBatchId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [chessLevel, setChessLevel] = useState("");
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editStudent, setEditStudent] = useState<ApiStudent | null>(null);
  const [assignStudent, setAssignStudent] = useState<ApiStudent | null>(null);
  const [form, setForm] = useState({ name: "", age: "", chessLevel: "", city: "", mobile: "" });
  const [assignForm, setAssignForm] = useState({ coach: "", batch: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchStudentsPaginated({
        page,
        limit,
        search: search || undefined,
        batchId: batchId || undefined,
        coachId: coachId || undefined,
        chessLevel: chessLevel || undefined,
      });
      setStudents(data.students);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, batchId, coachId, chessLevel]);

  useEffect(() => {
    fetchCoachOptions()
      .then(setCoaches)
      .catch(() => []);
    fetchBatchOptions()
      .then(setBatches)
      .catch(() => []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openEdit = (s: ApiStudent) => {
    setEditStudent(s);
    setForm({
      name: s.name,
      age: String(s.age),
      chessLevel: s.chessLevel,
      city: s.city,
      mobile: s.mobile || "",
    });
  };

  const openAssign = (s: ApiStudent) => {
    setAssignStudent(s);
    setAssignForm({ coach: refId(s.coach as never), batch: refId(s.batch as never) });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setSaving(true);
    try {
      await updateStudent(editStudent._id, {
        name: form.name,
        age: Number(form.age),
        chessLevel: form.chessLevel,
        city: form.city,
        mobile: form.mobile || undefined,
      });
      setEditStudent(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignStudent) return;
    setSaving(true);
    try {
      await updateStudent(assignStudent._id, {
        coach: assignForm.coach || undefined,
        batch: assignForm.batch || undefined,
      });
      setAssignStudent(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Assignment failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try {
      await deleteStudent(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-8 h-8 text-royal-400" />
          Academy Students
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Search, filter, and manage student records ({total} total).
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, ID, or mobile..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-white"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-royal-600 text-white text-sm font-bold">
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <select
            value={batchId}
            onChange={(e) => {
              setBatchId(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-white"
          >
            <option value="">All batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={coachId}
            onChange={(e) => {
              setCoachId(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-white"
          >
            <option value="">All coaches</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={chessLevel}
            onChange={(e) => {
              setChessLevel(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-white"
          >
            <option value="">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Student ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Level</th>
                  <th className="py-4 px-6">Batch / Coach</th>
                  <th className="py-4 px-6">Parent</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No students match your filters.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const coach =
                      typeof student.coach === "object" ? student.coach?.name : undefined;
                    const batch =
                      typeof student.batch === "object" ? student.batch?.name : undefined;
                    const parent =
                      typeof student.parent === "object" ? student.parent : undefined;

                    return (
                      <tr key={student._id} className="hover:bg-slate-900/20">
                        <td className="py-4 px-6 font-mono font-bold text-royal-400">{student.studentId}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-white block">{student.name}</span>
                          <span className="text-xs text-slate-500">
                            Age {student.age} · {student.city}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs">{student.chessLevel}</span>
                        </td>
                        <td className="py-4 px-6 text-xs">
                          <div>{batch || "Unassigned"}</div>
                          <div className="text-slate-500">{coach || "No coach"}</div>
                        </td>
                        <td className="py-4 px-6 text-xs">
                          <div className="text-white">{parent?.name || "—"}</div>
                          <div className="text-slate-500">{parent?.mobile}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Link
                              href={`/admin/students/${student._id}`}
                              className="p-2 rounded-lg bg-royal-950 text-royal-400 hover:bg-royal-600 hover:text-white"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEdit(student)}
                              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openAssign(student)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-800 text-royal-400"
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(student._id, student.name)}
                              className="p-2 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-sm">
            <span className="text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {(editStudent || assignStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white">{editStudent ? "Edit Student" : "Assign Batch & Coach"}</h3>
              <button
                type="button"
                onClick={() => {
                  setEditStudent(null);
                  setAssignStudent(null);
                }}
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {editStudent && (
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
                <input
                  required
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="Age"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
                <select
                  value={form.chessLevel}
                  onChange={(e) => setForm({ ...form, chessLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
                <input
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="Mobile"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            )}

            {assignStudent && (
              <form onSubmit={handleAssign} className="space-y-3">
                <p className="text-xs text-slate-400">{assignStudent.name}</p>
                <select
                  value={assignForm.batch}
                  onChange={(e) => setAssignForm({ ...assignForm, batch: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                >
                  <option value="">No batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <select
                  value={assignForm.coach}
                  onChange={(e) => setAssignForm({ ...assignForm, coach: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                >
                  <option value="">No coach</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save assignment"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
