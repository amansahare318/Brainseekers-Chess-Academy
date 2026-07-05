"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import {
  fetchGallery,
  createGalleryImage,
  deleteGalleryImage,
  type ApiGalleryImage,
} from "@/lib/gallery";
import { ApiError } from "@/lib/api";
import ImageUpload from "@/components/ui/ImageUpload";
import type { CloudinaryAsset } from "@/lib/settings";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<ApiGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", imageUrl: "", imagePublicId: "", category: "General" });
  const [imageAsset, setImageAsset] = useState<CloudinaryAsset>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setImages(await fetchGallery());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageAsset.url && !form.imageUrl) {
      setError("Please upload an image first");
      return;
    }
    setSaving(true);
    try {
      await createGalleryImage({
        title: form.title,
        imageUrl: imageAsset.url || form.imageUrl,
        imagePublicId: imageAsset.publicId || form.imagePublicId,
        category: form.category,
      });
      setShowForm(false);
      setForm({ title: "", imageUrl: "", imagePublicId: "", category: "General" });
      setImageAsset({});
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Gallery Management</h1>
          <p className="text-sm text-slate-400 mt-1">Add images by URL and categorize them.</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 text-white text-sm font-bold">
          <Plus className="w-4 h-4" />
          Add image
        </button>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-950/40 text-red-400 text-sm">{error}</div>}

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="glass-panel rounded-xl overflow-hidden group relative">
              <div className="relative aspect-square">
                <Image src={img.imageUrl} alt={img.title} fill className="object-cover" unoptimized />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-white truncate">{img.title}</p>
                <p className="text-xs text-slate-500">{img.category}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(img._id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 text-red-400 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={handleCreate} className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-3">
            <div className="flex justify-between">
              <h3 className="font-bold text-white">Add image</h3>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm" />
            <ImageUpload
              label="Gallery image"
              folder="gallery"
              value={imageAsset}
              onChange={(asset) => {
                setImageAsset(asset);
                setForm({ ...form, imageUrl: asset.url || "", imagePublicId: asset.publicId || "" });
              }}
            />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm" />
            <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl bg-royal-600 text-white font-bold text-sm">
              {saving ? "Saving..." : "Add"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
