"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Users, X } from "lucide-react";
import { fetchCoaches, createCoach, type ApiCoach } from "@/lib/coaches";
import { ApiError } from "@/lib/api";
import ImageUpload from "@/components/ui/ImageUpload";
import type { CloudinaryAsset } from "@/lib/settings";
import Image from "next/image";

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<ApiCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    elo: "",
    password: "",
  });
  const [photo, setPhoto] = useState<CloudinaryAsset>({ url: "", publicId: "" });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCoaches();
      setCoaches(data || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load coaches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo.url) {
      setError("Profile picture is mandatory.");
      return;
    }
    
    setSaving(true);
    setError("");
    try {
      await createCoach({
        ...form,
        photoUrl: photo.url,
        photoPublicId: photo.publicId,
      });
      setShowAdd(false);
      setForm({ name: "", email: "", title: "", elo: "", password: "" });
      setPhoto({ url: "", publicId: "" });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add coach");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-royal-400" />
            Academy Coaches
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your coaches. They will automatically be displayed on the homepage.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-royal-600 hover:bg-royal-500 text-white font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Coach
        </button>
      </div>

      {error && !showAdd && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

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
                  <th className="py-4 px-6">Coach</th>
                  <th className="py-4 px-6">Contact</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">ELO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {coaches.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      No coaches added yet.
                    </td>
                  </tr>
                ) : (
                  coaches.map((coach) => (
                    <tr key={coach._id} className="hover:bg-slate-900/20">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {coach.photoUrl ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                              <Image src={coach.photoUrl} alt={coach.name} fill className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-slate-500" />
                            </div>
                          )}
                          <span className="font-bold text-white">{coach.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{coach.email}</td>
                      <td className="py-4 px-6 text-royal-400 font-bold">{coach.title}</td>
                      <td className="py-4 px-6">{coach.elo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xl text-white">Add New Coach</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setError("");
                }}
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
              </div>
              <div className="flex gap-3">
                <div className="space-y-1 flex-1">
                  <label className="text-xs font-semibold text-slate-400">Title</label>
                  <input
                    required
                    placeholder="e.g. Grandmaster"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                  />
                </div>
                <div className="space-y-1 w-24">
                  <label className="text-xs font-semibold text-slate-400">ELO</label>
                  <input
                    required
                    value={form.elo}
                    onChange={(e) => setForm({ ...form, elo: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Temporary Password</label>
                <input
                  required
                  minLength={8}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="pt-2">
                <ImageUpload
                  label="Profile Picture (Mandatory)"
                  folder="coaches"
                  value={photo}
                  onChange={setPhoto}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-royal-500"
                >
                  {saving ? "Adding..." : "Add Coach"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
