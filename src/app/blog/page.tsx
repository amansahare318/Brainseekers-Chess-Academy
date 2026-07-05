import Link from "next/link";
import Image from "next/image";
import { fetchPublicBlogs } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function BlogListingPage() {
  let posts: Awaited<ReturnType<typeof fetchPublicBlogs>> = [];
  try {
    posts = await fetchPublicBlogs();
  } catch {
    posts = [];
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-950 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold text-white mb-2">Academy Blog</h1>
          <p className="text-slate-400 mb-10">Insights, tips, and updates from BrainSeekers Chess Academy.</p>
          <div className="space-y-8">
            {posts.length === 0 ? (
              <p className="text-slate-500">No published posts yet. Check back soon.</p>
            ) : (
              posts.map((post) => (
                <article key={post._id} className="glass-panel rounded-2xl overflow-hidden">
                  {post.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image src={post.featuredImage} alt="" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="p-6">
                    <time className="text-xs text-slate-500 font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                    <h2 className="text-xl font-bold text-white mt-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-royal-400">
                        {post.title}
                      </Link>
                    </h2>
                    <Link href={`/blog/${post.slug}`} className="inline-block mt-3 text-sm text-royal-400 font-bold">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
