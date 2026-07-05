"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { fetchSettings, updateSettings, type AcademySettings } from "@/lib/settings";
import ImageUpload from "@/components/ui/ImageUpload";
import { ApiError } from "@/lib/api";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<AcademySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings()
      .then(setForm)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await updateSettings(form);
      setForm(updated);
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof AcademySettings, label: string, type = "text") => {
    if (!form || key === "logo" || key === "certificateTemplate") return null;
    const val = form[key] as string;
    return (
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-400">{label}</label>
        {type === "textarea" ? (
          <textarea
            rows={4}
            value={val}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
          />
        ) : (
          <input
            type={type}
            value={val}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!form) {
    return <p className="text-red-400">{error || "Settings unavailable"}</p>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Academy Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure academy information shown across the website.</p>
      </div>

      {message && <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 text-sm">{message}</div>}
      {error && <div className="p-3 rounded-xl bg-red-950/40 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-8">
        <section className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-bold text-white">Academy Information</h2>
          {field("academyName", "Academy Name")}
          {field("tagline", "Tagline")}
          {field("description", "Description", "textarea")}
          <ImageUpload
            label="Academy Logo"
            folder="logo"
            value={form.logo || {}}
            onChange={(logo) => setForm({ ...form, logo })}
          />
        </section>

        <section className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-bold text-white">Contact</h2>
          {field("mobile", "Mobile")}
          {field("whatsapp", "WhatsApp")}
          {field("email", "Email", "email")}
        </section>

        <section className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-bold text-white">Address</h2>
          {field("address", "Address")}
          {field("city", "City")}
          {field("state", "State")}
          {field("country", "Country")}
        </section>

        <section className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-bold text-white">Social Media</h2>
          {field("facebook", "Facebook URL")}
          {field("instagram", "Instagram URL")}
          {field("youtube", "YouTube URL")}
          {field("linkedin", "LinkedIn URL")}
        </section>

        <section className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-bold text-white">Certificates</h2>
          {field("signatureName", "Signature Name")}
          {field("signatureTitle", "Signature Title")}
          <ImageUpload
            label="Certificate Template"
            folder="certificates"
            value={form.certificateTemplate || {}}
            onChange={(certificateTemplate) => setForm({ ...form, certificateTemplate })}
          />
        </section>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </div>
  );
}
