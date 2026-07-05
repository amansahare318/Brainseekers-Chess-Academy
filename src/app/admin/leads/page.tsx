"use client";

import { useCallback, useEffect, useState } from "react";
import { Lead, LeadStatus } from "@/types/academy";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, UserPlus, Eye, Loader2 } from "lucide-react";
import {
  fetchLeads,
  fetchLeadById,
  updateLead,
  convertLead,
  mapApiLead,
} from "@/lib/leads";
import { fetchCoachOptions, type CoachOption } from "@/lib/coaches";
import { fetchBatchOptions, type BatchOption } from "@/lib/batches";
import { ApiError } from "@/lib/api";

const STATUS_OPTIONS: LeadStatus[] = [
  "New",
  "Contacted",
  "Trial Scheduled",
  "Trial Completed",
  "Approved",
  "Rejected",
];

function statusClass(status: LeadStatus) {
  switch (status) {
    case "New":
      return "bg-blue-950/60 text-blue-400 border border-blue-500/20";
    case "Contacted":
      return "bg-indigo-950/60 text-indigo-400 border border-indigo-500/20";
    case "Trial Scheduled":
      return "bg-amber-950/60 text-amber-400 border border-amber-500/20";
    case "Trial Completed":
      return "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20";
    case "Approved":
      return "bg-emerald-950 text-emerald-400";
    case "Rejected":
      return "bg-red-950/60 text-red-400 border border-red-500/20";
    default:
      return "bg-slate-800 text-slate-400";
  }
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalType, setModalType] = useState<"view" | "schedule" | "convert" | "credentials" | null>(null);
  const [credentialsNote, setCredentialsNote] = useState("");

  const [trialDate, setTrialDate] = useState("");
  const [trialTime, setTrialTime] = useState("10:00 AM");
  const [assignedCoach, setAssignedCoach] = useState("");
  const [assignedBatch, setAssignedBatch] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [leadData, coachData, batchData] = await Promise.all([
        fetchLeads(),
        fetchCoachOptions().catch(() => [] as CoachOption[]),
        fetchBatchOptions().catch(() => [] as BatchOption[]),
      ]);
      setLeads(leadData);
      setCoaches(coachData);
      setBatches(batchData);
      if (coachData[0]) setAssignedCoach(coachData[0].id);
      if (batchData[0]) setAssignedBatch(batchData[0].id);
    } catch (err) {
      setPageError(err instanceof ApiError ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const refreshLeadInList = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
  };

  const openModal = async (lead: Lead, type: "view" | "schedule" | "convert") => {
    setPageError("");
    try {
      const detail = await fetchLeadById(lead.id);
      setSelectedLead(detail);
      setModalType(type);
      if (type === "schedule") {
        setTrialDate(detail.trialDate || "");
        setTrialTime(detail.trialTime || "10:00 AM");
      }
    } catch (err) {
      setPageError(err instanceof ApiError ? err.message : "Failed to load lead details");
    }
  };

  const closeModal = () => {
    setSelectedLead(null);
    setModalType(null);
    setCredentialsNote("");
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !trialDate) return;
    setActionLoading(true);
    try {
      const updated = await updateLead(selectedLead.id, {
        status: "Trial Scheduled",
        trialDate,
        trialTime,
      });
      refreshLeadInList(updated);
      closeModal();
    } catch (err) {
      setPageError(err instanceof ApiError ? err.message : "Failed to schedule trial");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (status: LeadStatus) => {
    if (!selectedLead) return;
    setActionLoading(true);
    try {
      const updated = await updateLead(selectedLead.id, { status });
      refreshLeadInList(updated);
    } catch (err) {
      setPageError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConversionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setActionLoading(true);
    try {
      const result = await convertLead(selectedLead.id, {
        coachId: assignedCoach || undefined,
        batchId: assignedBatch || undefined,
      });
      refreshLeadInList(mapApiLead(result.lead));
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? mapApiLead(result.lead) : l)));
      const lines: string[] = [];
      if (result.credentials?.parent) {
        lines.push(
          `Parent login — mobile: ${result.credentials.parent.mobile}, temp password: ${result.credentials.parent.temporaryPassword}`
        );
      }
      if (result.credentials?.student) {
        lines.push(
          `Student login — mobile: ${result.credentials.student.mobile}, temp password: ${result.credentials.student.temporaryPassword}`
        );
      }
      setCredentialsNote(
        lines.length
          ? lines.join("\n")
          : `Student enrolled: ${result.student.studentId}. Portal accounts already exist for this family.`
      );
      setModalType("credentials");
    } catch (err) {
      setPageError(err instanceof ApiError ? err.message : "Failed to convert lead");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Leads Pipeline</h1>
          <p className="text-sm text-slate-400 mt-1">Live data from MongoDB — review, schedule, and convert leads.</p>
        </div>
        <button
          type="button"
          onClick={loadLeads}
          disabled={loading}
          className="text-xs font-bold text-royal-400 hover:text-royal-300 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {pageError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-sm text-red-300">{pageError}</div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No leads yet. Trial registrations will appear here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Lead ID</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Parent</th>
                  <th className="py-4 px-6">Level</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-royal-400 text-xs">
                      {lead.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-white block">{lead.studentName}</span>
                      <span className="text-xs text-slate-500">Age: {lead.age}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span>{lead.parentName}</span>
                      <span className="text-xs text-slate-500 block">{lead.parentMobile}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-white/5 text-xs">
                        {lead.chessLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${statusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openModal(lead, "view")}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                        title="View Lead"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {lead.status !== "Approved" && (
                        <>
                          <button
                            type="button"
                            onClick={() => openModal(lead, "schedule")}
                            className="p-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-amber-950/40 cursor-pointer"
                            title="Schedule Trial"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openModal(lead, "convert")}
                            className="p-1.5 rounded-lg bg-royal-950 text-royal-400 hover:bg-royal-600 hover:text-white cursor-pointer"
                            title="Convert to Student"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalType && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-display font-extrabold text-xl text-white">
                  {modalType === "view" && "Lead Information"}
                  {modalType === "schedule" && "Schedule Trial Class"}
                  {modalType === "convert" && "Convert To Student"}
                  {modalType === "credentials" && "Enrollment Complete"}
                </h3>
                <button type="button" onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalType === "view" && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-slate-500 font-mono">STUDENT</h4>
                      <p className="font-bold text-white mt-1">
                        {selectedLead.studentName} (Age {selectedLead.age})
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-500 font-mono">LEVEL</h4>
                      <p className="font-bold text-white mt-1">{selectedLead.chessLevel}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 font-mono">CONTACT</h4>
                    <p className="font-bold text-white mt-1">
                      {selectedLead.parentMobile}
                      {selectedLead.parentEmail && ` — ${selectedLead.parentEmail}`}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 font-mono">NOTES</h4>
                    <p className="font-bold text-white mt-1">{selectedLead.learningGoal || "No notes provided"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-slate-500 font-mono">STATUS</h4>
                      <p className="font-bold text-white mt-1">{selectedLead.status}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-500 font-mono">CREATED</h4>
                      <p className="font-bold text-white mt-1">{selectedLead.createdAt}</p>
                    </div>
                  </div>
                  {selectedLead.status !== "Approved" && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <h4 className="text-xs text-slate-500 font-mono">UPDATE STATUS</h4>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.filter((s) => s !== selectedLead.status).map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusChange(s)}
                            className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer disabled:opacity-50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalType === "schedule" && (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Trial Date</label>
                    <input
                      type="date"
                      required
                      value={trialDate}
                      onChange={(e) => setTrialDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Time Slot</label>
                    <select
                      value={trialTime}
                      onChange={(e) => setTrialTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white cursor-pointer"
                    >
                      <option>10:00 AM</option>
                      <option>1:00 PM</option>
                      <option>3:00 PM</option>
                      <option>6:00 PM</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-bold disabled:opacity-60"
                  >
                    {actionLoading ? "Saving..." : "Confirm Schedule"}
                  </button>
                </form>
              )}

              {modalType === "convert" && (
                <form onSubmit={handleConversionSubmit} className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Converts lead to student + parent records and issues portal credentials when needed.
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Assign Coach (optional)</label>
                    <select
                      value={assignedCoach}
                      onChange={(e) => setAssignedCoach(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white cursor-pointer"
                    >
                      <option value="">— None —</option>
                      {coaches.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.title})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Assign Batch (optional)</label>
                    <select
                      value={assignedBatch}
                      onChange={(e) => setAssignedBatch(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white cursor-pointer"
                    >
                      <option value="">— None —</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-3.5 rounded-xl bg-royal-600 text-white font-bold disabled:opacity-60"
                  >
                    {actionLoading ? "Converting..." : "Confirm Enrollment"}
                  </button>
                </form>
              )}

              {modalType === "credentials" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-950/60 p-4 rounded-xl border border-white/5">
                    {credentialsNote}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      loadLeads();
                      closeModal();
                    }}
                    className="w-full py-3 rounded-xl bg-royal-600 text-white font-bold"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
