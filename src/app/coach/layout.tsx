import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
