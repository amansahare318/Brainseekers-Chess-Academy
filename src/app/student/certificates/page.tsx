"use client";

import { useEffect, useState } from "react";
import { fetchCertificates, openCertificateDownload, type ApiCertificate } from "@/lib/certificates";
import { Download } from "lucide-react";

export default function StudentCertificatesPage() {
  const [certs, setCerts] = useState<ApiCertificate[]>([]);

  useEffect(() => {
    fetchCertificates().then(setCerts);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">My Certificates</h1>
      {certs.length === 0 ? (
        <p className="text-slate-500 text-sm">No certificates issued yet.</p>
      ) : (
        certs.map((c) => (
          <div key={c._id} className="glass-panel p-6 rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{c.certificateName}</p>
              <p className="text-xs text-slate-500">{new Date(c.issueDate).toLocaleDateString()}</p>
            </div>
            <button type="button" onClick={() => openCertificateDownload(c._id)} className="flex items-center gap-2 text-sm text-royal-400 font-bold cursor-pointer">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        ))
      )}
    </div>
  );
}
