"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchGallery, fetchGalleryCategories } from "@/lib/gallery";

export default function PublicGalleryPage() {
  const [images, setImages] = useState<Awaited<ReturnType<typeof fetchGallery>>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchGalleryCategories().then(setCategories).catch(() => []);
  }, []);

  useEffect(() => {
    fetchGallery(category || undefined).then(setImages).catch(() => setImages([]));
  }, [category]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-950 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold text-white mb-2">Gallery</h1>
          <p className="text-slate-400 mb-8">Moments from classes, tournaments, and academy life.</p>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setCategory("")}
              className={`px-4 py-2 rounded-xl text-sm font-bold ${!category ? "bg-royal-600 text-white" : "bg-slate-800 text-slate-400"}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${category === c ? "bg-royal-600 text-white" : "bg-slate-800 text-slate-400"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img._id} className="glass-panel rounded-xl overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={img.imageUrl} alt={img.title} fill className="object-cover" unoptimized />
                </div>
                <p className="p-3 text-sm font-semibold text-white">{img.title}</p>
              </div>
            ))}
          </div>
          {images.length === 0 && <p className="text-slate-500 text-center py-12">No images in this category yet.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
