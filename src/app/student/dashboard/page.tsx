"use client";

import { useEffect, useState } from "react";
import { Calendar, BookOpen, FileText, Award, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchMyBatch } from "@/lib/batches";
import { fetchAssignments } from "@/lib/assignments";
import { fetchReports } from "@/lib/reports";
import { fetchCertificates } from "@/lib/certificates";
import { fetchAttendanceByStudent } from "@/lib/attendance";
import { useAuthStore } from "@/store/useAuthStore";

export default function StudentDashboardPage() {
  const profileRef = useAuthStore((s) => s.user?.profileRef);
  const [batchName, setBatchName] = useState("—");
  const [pendingHw, setPendingHw] = useState(0);
  const [reports, setReports] = useState(0);
  const [certs, setCerts] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState("—");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [batch, assignments, reps, certificates] = await Promise.all([
          fetchMyBatch().catch(() => null),
          fetchAssignments().catch(() => []),
          fetchReports().catch(() => []),
          fetchCertificates().catch(() => []),
        ]);
        if (batch?.batch && typeof batch.batch === "object" && "name" in batch.batch) {
          setBatchName(batch.batch.name as string);
        }
        setPendingHw(assignments.filter((a) => !a.submission).length);
        setReports(reps.length);
        setCerts(certificates.length);
        if (profileRef) {
          const att = await fetchAttendanceByStudent(profileRef).catch(() => []);
          const present = att.filter((a) => a.status === "Present").length;
          setAttendanceRate(att.length ? `${Math.round((present / att.length) * 100)}%` : "—");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [profileRef]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Student Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Your live academy data.</p>
      </div>

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "My Batch", value: batchName, icon: Calendar },
            { label: "Attendance", value: attendanceRate, icon: Calendar },
            { label: "Pending HW", value: pendingHw, icon: BookOpen },
            { label: "Reports", value: reports, icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="glass-panel p-5 rounded-2xl">
                <Icon className="w-5 h-5 text-royal-400 mb-2" />
                <p className="text-xs text-slate-500 font-mono uppercase">{item.label}</p>
                <p className="text-xl font-black text-white">{item.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/student/assignments" className="text-royal-400 font-bold">Assignments</Link>
        <Link href="/student/progress" className="text-royal-400 font-bold">Progress</Link>
        <Link href="/student/certificates" className="text-royal-400 font-bold">Certificates ({certs})</Link>
      </div>
    </div>
  );
}
