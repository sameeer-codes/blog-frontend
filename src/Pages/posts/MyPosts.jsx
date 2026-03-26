import ActionButton from "../../ui/ActionButton";

const myPosts = [
  {
    post_id: 9,
    post_title: "Designing stable frontend contracts before backend integration",
    post_slug: "designing-stable-frontend-contracts-before-backend-integration",
    post_status: "draft",
    created_at: "2026-03-25 09:20:00",
    updated_at: "2026-03-25 10:45:00",
    post_excerpt:
      "A planning-driven draft focused on building the right screens before wiring live data.",
  },
  {
    post_id: 7,
    post_title: "Handling uploads, metadata, and ownership in a compact admin flow",
    post_slug: "handling-uploads-metadata-and-ownership-in-a-compact-admin-flow",
    post_status: "published",
    created_at: "2026-03-22 08:10:00",
    updated_at: "2026-03-24 14:00:00",
    post_excerpt:
      "A practical piece on turning upload endpoints into a usable author experience.",
  },
  {
    post_id: 5,
    post_title: "When to archive content instead of deleting it from a small blog system",
    post_slug: "when-to-archive-content-instead-of-deleting-it-from-a-small-blog-system",
    post_status: "archived",
    created_at: "2026-03-18 11:00:00",
    updated_at: "2026-03-20 16:30:00",
    post_excerpt:
      "A content governance note about drafts, published writing, and the archive lifecycle.",
  },
];

const statusStyles = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

export default function MyPosts() {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50">
      <section className="mx-auto w-full max-w-[1280px] px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Admin Dashboard
            </p>
            <h1 className="text-4xl">Your posts across every status</h1>
            <p className="max-w-3xl text-base leading-8 text-secondary">
              This screen is prepared for `GET /api/posts/me`, so the authenticated
              admin can review draft, published, and archived posts in one place.
            </p>
          </div>
          <ActionButton to="/post/create" variant="primary">
            Create new post
          </ActionButton>
        </div>

        <div className="grid gap-5">
          {myPosts.map((post) => (
            <article
              key={post.post_id}
              className="rounded-[28px] bg-white p-6 shadow-soft"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
                        statusStyles[post.post_status]
                      }`}
                    >
                      {post.post_status}
                    </span>
                    <span className="text-sm text-secondary">
                      Post #{post.post_id}
                    </span>
                  </div>
                  <div>
                    <h2 className="max-w-3xl text-2xl leading-snug">
                      {post.post_title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-secondary">
                      {post.post_excerpt}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-secondary">
                    <span>Created: {post.created_at}</span>
                    <span>Updated: {post.updated_at}</span>
                    <span>Slug: {post.post_slug}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    to={`/post/edit/${post.post_id}`}
                    variant="secondary"
                    classes="!px-4 !py-2"
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    to={`/blog/${post.post_slug}`}
                    variant="dark"
                    classes="!px-4 !py-2 !font-medium"
                  >
                    Preview
                  </ActionButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
