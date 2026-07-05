"use client";

import { useEffect, useState } from "react";
import { fetchCertificates, createCertificate, deleteCertificate, openCertificateDownload } from "@/lib/certificates";
import { fetchStudents } from "@/lib/students";
import type { ApiCertificate } from "@/lib/certificates";
import { Download, Trash2 } from "lucide-react";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<ApiCertificate[]>([]);
  const [students, setStudents] = useState<{ _id: string; name: string }[]>([]);
  const [form, setForm] = useState({ student: "", certificateName: "", description: "" });

  const load = () => fetchCertificates().then(setCerts);

  useEffect(() => {
    Promise.all([load(), fetchStudents()]).then(([, s]) => {
      setStudents(s.map((x) => ({ _id: x._id, name: x.name })));
      if (s[0]) setForm((f) => ({ ...f, student: s[0]._id }));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCertificate(form);
    load();
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-white">Certificates</h1>

      <form onSubmit={handleCreate} className="glass-panel p-6 rounded-2xl space-y-4 max-w-lg">
        <select required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm">
          {students.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <input required placeholder="Certificate name" value={form.certificateName} onChange={(e) => setForm({ ...form, certificateName: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm" />
        <button type="submit" className="w-full py-3 rounded-xl bg-royal-600 font-bold text-white">Generate Certificate</button>
      </form>

      <div className="space-y-3">
        {certs.map((c) => (
          <div key={c._id} className="glass-panel p-5 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{c.certificateName}</p>
              <p className="text-xs text-slate-500">{typeof c.student === "object" ? c.student.name : ""}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openCertificateDownload(c._id)} className="p-2 text-royal-400 cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => deleteCertificate(c._id).then(load)} className="p-2 text-red-400 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
