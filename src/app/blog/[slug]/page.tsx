import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchPublicBlogBySlug } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof fetchPublicBlogBySlug>> | null = null;
  try {
    post = await fetchPublicBlogBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const authorName =
    typeof post.author === "object" && post.author && "name" in post.author
      ? post.author.name
      : "BrainSeekers";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-950 pt-28 pb-16">
        <article className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="text-sm text-royal-400 font-bold hover:underline">
            ← All posts
          </Link>
          {post.featuredImage && (
            <div className="relative h-64 w-full mt-6 rounded-2xl overflow-hidden">
              <Image src={post.featuredImage} alt="" fill className="object-cover" unoptimized />
            </div>
          )}
          <header className="mt-8 space-y-2">
            <time className="text-xs text-slate-500 font-mono">{new Date(post.createdAt).toLocaleDateString()}</time>
            <h1 className="font-display text-4xl font-extrabold text-white">{post.title}</h1>
            <p className="text-sm text-slate-400">By {authorName}</p>
          </header>
          <div
            className="prose prose-invert max-w-none mt-8 text-slate-300 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
