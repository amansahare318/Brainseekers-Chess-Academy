"use client";

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      
      {/* Desktop Sidebar Panel */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
