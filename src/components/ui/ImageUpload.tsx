"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { uploadImage, deleteUploadedImage } from "@/lib/uploads";
import { ApiError } from "@/lib/api";
import type { CloudinaryAsset } from "@/lib/settings";

interface ImageUploadProps {
  label?: string;
  folder: string;
  value: CloudinaryAsset;
  onChange: (asset: CloudinaryAsset) => void;
}

export default function ImageUpload({ label, folder, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      if (value.publicId) {
        await deleteUploadedImage(value.publicId).catch(() => undefined);
      }
      const result = await uploadImage(file, folder);
      onChange({ url: result.url, publicId: result.publicId });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value.publicId) {
      try {
        await deleteUploadedImage(value.publicId);
      } catch {
        /* ignore */
      }
    }
    onChange({ url: "", publicId: "" });
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-slate-400">{label}</label>}
      <div className="flex items-start gap-4">
        {value.url ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
            <Image src={value.url} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-slate-500 shrink-0">
            <Upload className="w-6 h-6" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 rounded-lg bg-slate-800 text-xs font-bold text-white disabled:opacity-50"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
              </span>
            ) : value.url ? (
              "Replace image"
            ) : (
              "Upload image"
            )}
          </button>
          {value.url && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 rounded-lg bg-red-950/50 text-xs font-bold text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
