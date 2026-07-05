"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, User, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  fetchStudentById,
  updateStudent,
  deleteStudent,
  refId,
  type ApiStudent,
} from "@/lib/students";
import { fetchAttendanceByStudent } from "@/lib/attendance";
import { fetchAssignments } from "@/lib/assignments";
import { fetchReportsForStudent } from "@/lib/reports";
import { fetchCertificates } from "@/lib/certificates";
import { fetchCoachOptions } from "@/lib/coaches";
import { fetchBatchOptions } from "@/lib/batches";
import { ApiError } from "@/lib/api";

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState<ApiStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "assignments" | "progress" | "certificates">("overview");
  const [attendance, setAttendance] = useState<Awaited<ReturnType<typeof fetchAttendanceByStudent>>>([]);
  const [assignments, setAssignments] = useState<Awaited<ReturnType<typeof fetchAssignments>>>([]);
  const [reports, setReports] = useState<Awaited<ReturnType<typeof fetchReportsForStudent>>>([]);
  const [certificates, setCertificates] = useState<Awaited<ReturnType<typeof fetchCertificates>>>([]);
  const [showAssign, setShowAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ coach: "", batch: "" });
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchStudentById(id)
      .then((s) => {
        setStudent(s);
        setAssignForm({ coach: refId(s.coach as never), batch: refId(s.batch as never) });
        const batchId = refId(s.batch as never);
        return Promise.all([
          fetchAttendanceByStudent(id).catch(() => []),
          fetchAssignments().then((all) =>
            batchId ? all.filter((a) => refId(a.batch as never) === batchId) : all
          ),
          fetchReportsForStudent(id).catch(() => []),
          fetchCertificates(id).catch(() => []),
        ]);
      })
      .then((result) => {
        if (result) {
          setAttendance(result[0]);
          setAssignments(result[1]);
          setReports(result[2]);
          setCertificates(result[3]);
        }
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load student"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (showAssign) {
      Promise.all([fetchCoachOptions(), fetchBatchOptions()]).then(([c, b]) => {
        setCoaches(c);
        setBatches(b);
      });
    }
  }, [showAssign]);

  const handleDelete = async () => {
    if (!student || !confirm(`Delete ${student.name}?`)) return;
    try {
      await deleteStudent(student._id);
      router.push("/admin/students");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    try {
      const updated = await updateStudent(student._id, {
        coach: assignForm.coach || undefined,
        batch: assignForm.batch || undefined,
      });
      setStudent(updated);
      setShowAssign(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Assignment failed");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">{error || "Student not found"}</h2>
        <Link href="/admin/students" className="text-royal-400 font-bold hover:underline">
          Return to roster
        </Link>
      </div>
    );
  }

  const coachName = typeof student.coach === "object" ? student.coach?.name : undefined;
  const batchName = typeof student.batch === "object" ? student.batch?.name : undefined;
  const parent = typeof student.parent === "object" ? student.parent : undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/students" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase font-mono">
          <ArrowLeft className="w-4 h-4" />
          Back to roster
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAssign(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-royal-400 text-xs font-bold flex items-center gap-1"
          >
            <Pencil className="w-3.5 h-3.5" />
            Assign batch/coach
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg bg-red-950/50 text-red-400 text-xs font-bold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-950/40 text-red-400 text-sm">{error}</div>}

      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-24 h-24 rounded-2xl bg-royal-950/80 border border-royal-500/25 flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-royal-500" />
        </div>
        <div className="space-y-4 flex-grow text-center md:text-left">
          <div>
            <span className="text-[10px] font-mono font-bold text-royal-400 uppercase tracking-widest block mb-1">
              {student.studentId}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">{student.name}</h1>
            <p className="text-slate-400 text-xs mt-1">
              Age {student.age} · {student.city} · Joined{" "}
              {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 text-sm">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Level</span>
              <span className="text-white font-semibold">{student.chessLevel}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Batch</span>
              <span className="text-white font-semibold">{batchName || "Unassigned"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Coach</span>
              <span className="text-white font-semibold">{coachName || "Unassigned"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Mobile</span>
              <span className="text-white font-semibold">{student.mobile || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {(["overview", "attendance", "assignments", "progress", "certificates"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase font-mono ${
              activeTab === tab ? "bg-royal-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="min-h-[200px]"
        >
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-3 text-sm">
                <h3 className="font-bold text-white">Student details</h3>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-500 text-xs font-mono">City</span>
                  <span className="text-white">{student.city}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-500 text-xs font-mono">Address</span>
                  <span className="text-white">{student.address || "—"}</span>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl space-y-3 text-sm">
                <h3 className="font-bold text-white">Parent</h3>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-500 text-xs font-mono">Name</span>
                  <span className="text-white">{parent?.name || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-slate-500 text-xs font-mono">Mobile</span>
                  <span className="text-white">{parent?.mobile || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs font-mono uppercase text-slate-500">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-slate-500">
                        No attendance records
                      </td>
                    </tr>
                  ) : (
                    attendance.map((a) => (
                      <tr key={a._id}>
                        <td className="py-3 px-6 font-mono">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="py-3 px-6">{a.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs font-mono uppercase text-slate-500">
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-slate-500">
                        No assignments for this batch
                      </td>
                    </tr>
                  ) : (
                    assignments.map((a) => (
                      <tr key={a._id}>
                        <td className="py-3 px-6 text-white font-semibold">{a.title}</td>
                        <td className="py-3 px-6 text-slate-400">{new Date(a.dueDate).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="grid md:grid-cols-3 gap-4">
              {reports.length === 0 ? (
                <p className="text-slate-500 col-span-3 text-center py-8">No progress reports yet</p>
              ) : (
                reports.map((r) => (
                  <div key={r._id} className="glass-panel p-6 rounded-2xl">
                    <p className="text-xs text-slate-500 font-mono">{new Date(r.createdAt).toLocaleDateString()}</p>
                    <p className="text-2xl font-black text-white mt-2">{r.rating} / 100</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{r.remarks}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No certificates issued</p>
              ) : (
                certificates.map((c) => (
                  <div key={c._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                    <span className="text-white font-semibold">{c.certificateName}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(c.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={handleAssign} className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white">Assign batch & coach</h3>
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
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAssign(false)} className="flex-1 py-2 rounded-xl bg-slate-800 text-white text-sm">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 rounded-xl bg-royal-600 text-white text-sm font-bold">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
