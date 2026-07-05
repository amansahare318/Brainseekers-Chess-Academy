"use client";

import { useEffect, useState } from "react";
import { fetchBatches, type ApiBatch } from "@/lib/batches";
import { Loader2 } from "lucide-react";

export default function CoachBatchesPage() {
  const [batches, setBatches] = useState<ApiBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches()
      .then(setBatches)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">My Batches</h1>
      {loading ? (
        <div className="flex gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="grid gap-4">
          {batches.map((b) => (
            <div key={b._id} className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white">{b.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{b.schedule}</p>
              <p className="text-xs text-royal-400 font-mono mt-2">{b.studentCount ?? 0} students</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
