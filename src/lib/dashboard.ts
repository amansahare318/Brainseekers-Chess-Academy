import { fetchLeads } from '@/lib/leads';
import { fetchStudents } from '@/lib/students';
import { fetchBatches } from '@/lib/batches';
import { fetchAttendanceStats } from '@/lib/attendance';
import { fetchAssignments } from '@/lib/assignments';
import { fetchReports } from '@/lib/reports';
import { fetchCertificates } from '@/lib/certificates';
import { fetchCoachOptions } from '@/lib/coaches';

export async function fetchAdminDashboardStats() {
  const now = new Date();
  const [leads, students, batches, attendance, assignments, reports, certificates, coaches] =
    await Promise.all([
      fetchLeads().catch(() => []),
      fetchStudents().catch(() => []),
      fetchBatches().catch(() => []),
      fetchAttendanceStats(now.getMonth() + 1, now.getFullYear()).catch(() => null),
      fetchAssignments().catch(() => []),
      fetchReports().catch(() => []),
      fetchCertificates().catch(() => []),
      fetchCoachOptions().catch(() => []),
    ]);

  const present =
    attendance?.totals?.find((t) => t._id === 'Present')?.count ?? 0;

  return {
    leads: leads.length,
    students: students.length,
    batches: batches.length,
    coaches: coaches.length,
    trialsScheduled: leads.filter((l) => l.status === 'Trial Scheduled').length,
    assignments: assignments.length,
    reports: reports.length,
    certificates: certificates.length,
    attendancePresentMonth: present,
  };
}
