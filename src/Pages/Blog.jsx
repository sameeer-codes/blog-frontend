import { Link, useParams } from "react-router";
import Header from "../components/Header";

const relatedPosts = [
  {
    title: "Handling refresh tokens in a custom PHP app",
    slug: "handling-refresh-tokens-in-a-custom-php-app",
  },
  {
    title: "Media uploads with ownership checks",
    slug: "media-uploads-with-ownership-checks",
  },
  {
    title: "Designing a small but strict post editor",
    slug: "designing-a-small-but-strict-post-editor",
  },
];

export default function Blog() {
  const { slug } = useParams();
  const readableSlug = slug?.split("-").join(" ") || "blog post";

  return (
    <>
      <Header />
      <main className="bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <section className="mx-auto w-full max-w-[980px] px-4 py-14">
          <div className="rounded-[32px] bg-white p-6 shadow-soft md:p-10">
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-secondary">
              <Link to="/blog" className="font-medium hover:text-primary">
                Blog
              </Link>
              <span>/</span>
              <span className="capitalize">{readableSlug}</span>
            </div>

            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Single Post Template
              </p>
              <h1 className="max-w-3xl text-4xl leading-tight capitalize md:text-5xl">
                {readableSlug}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-secondary">
                This page is the public article detail shell for the eventual
                `GET /api/posts/single` integration. It already has space for title,
                excerpt, featured media, metadata, and full article content.
              </p>
            </div>

            <div className="my-10 rounded-[28px] border border-slate-200 bg-slate-50 p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                <span>Published March 25, 2026</span>
                <span>Author: Sameer</span>
                <span>Status: Published</span>
              </div>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
                Featured-image and excerpt-aware storytelling would render here.
                For now, this is a static content scaffold that mirrors the backend
                post shape and leaves room for real content binding once the API work starts.
              </p>
            </div>

            <div className="mb-10 rounded-[24px] border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-7 text-slate-700">
              This article page is intentionally instructional right now: it shows where
              post metadata, featured media, body content, and related links will land once
              the single-post endpoint is wired.
            </div>

            <article className="max-w-none">
              <div className="space-y-6 text-base leading-8 text-slate-700">
                <p>
                  The single post page needs to present long-form writing clearly,
                  without crowding the interface. The current scaffold favors strong
                  hierarchy, wide line spacing, and a simple reading rhythm so the real
                  API data can drop in later with minimal churn.
                </p>
                <p>
                  It also gives the frontend a defined home for every field in the API:
                  title, slug, content, excerpt, featured image reference, author, and
                  timestamps. When the backend is ready, these placeholders can be replaced
                  with fetched data instead of requiring structural redesign.
                </p>
              </div>
            </article>
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl">Related reading</h2>
              <Link to="/blog" className="text-sm font-semibold text-accent-primary">
                View all posts
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft hover:border-accent-primary"
                >
                  <h3 className="text-lg capitalize">{post.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">
                    Placeholder related post card for the eventual published-post feed.
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
