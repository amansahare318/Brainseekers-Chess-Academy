"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import {
  fetchAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  type ApiBlogPost,
} from "@/lib/blog";
import { ApiError } from "@/lib/api";
import ImageUpload from "@/components/ui/ImageUpload";
import type { CloudinaryAsset } from "@/lib/settings";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [active, setActive] = useState<ApiBlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    featuredImage: "",
    featuredImagePublicId: "",
    published: false,
    slug: "",
  });
  const [featuredAsset, setFeaturedAsset] = useState<CloudinaryAsset>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPosts(await fetchAdminBlogs());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({ title: "", content: "", featuredImage: "", featuredImagePublicId: "", published: false, slug: "" });
    setFeaturedAsset({});
    setActive(null);
    setModal("create");
  };

  const openEdit = (p: ApiBlogPost) => {
    setActive(p);
    setForm({
      title: p.title,
      content: p.content || "",
      featuredImage: p.featuredImage || "",
      featuredImagePublicId: (p as { featuredImagePublicId?: string }).featuredImagePublicId || "",
      published: p.published,
      slug: p.slug,
    });
    setFeaturedAsset({
      url: p.featuredImage || "",
      publicId: (p as { featuredImagePublicId?: string }).featuredImagePublicId || "",
    });
    setModal("edit");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        featuredImage: featuredAsset.url || form.featuredImage,
        featuredImagePublicId: featuredAsset.publicId || form.featuredImagePublicId,
      };
      if (modal === "create") {
        await createBlog(body);
      } else if (active) {
        await updateBlog(active._id, body);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteBlog(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  const togglePublish = async (p: ApiBlogPost) => {
    try {
      await updateBlog(p._id, { published: !p.published });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Blog Management</h1>
          <p className="text-sm text-slate-400 mt-1">Create, edit, and publish academy articles.</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 text-white text-sm font-bold">
          <Plus className="w-4 h-4" />
          New post
        </button>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-950/40 text-red-400 text-sm">{error}</div>}

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p._id} className="glass-panel p-4 rounded-xl flex flex-wrap justify-between gap-4 items-center">
              <div>
                <h3 className="font-bold text-white">{p.title}</h3>
                <p className="text-xs text-slate-500 font-mono">/blog/{p.slug}</p>
                <span className={`text-xs mt-1 inline-block ${p.published ? "text-emerald-400" : "text-amber-400"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => togglePublish(p)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-royal-400">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" onClick={() => openEdit(p)} className="p-2 rounded-lg bg-slate-800">
                  <Pencil className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-red-950/50 text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <form onSubmit={handleSave} className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-3 my-8">
            <div className="flex justify-between">
              <h3 className="font-bold text-white">{modal === "create" ? "New post" : "Edit post"}</h3>
              <button type="button" onClick={() => setModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm" />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (optional)" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm" />
            <ImageUpload
              label="Featured image"
              folder="blog"
              value={featuredAsset}
              onChange={(asset) => {
                setFeaturedAsset(asset);
                setForm({ ...form, featuredImage: asset.url || "", featuredImagePublicId: asset.publicId || "" });
              }}
            />
            <textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Content (HTML or markdown)" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
            <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl bg-royal-600 text-white font-bold text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
