import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import Header from "../../components/Header";
import Input from "../../ui/Input";
import ActionButton from "../../ui/ActionButton";

const posts = [
  {
    post_id: 3,
    post_title: "How I structured my first custom PHP blog backend for future frontend work",
    post_slug: "how-i-structured-my-first-custom-php-blog-backend-for-future-frontend-work",
    post_excerpt:
      "A long-form breakdown of routers, middleware, models, and how those decisions shape a maintainable frontend integration surface.",
    created_at: "2026-03-24 10:00:00",
    post_status: "published",
  },
  {
    post_id: 2,
    post_title: "Custom PHP authentication guide for JWT and refresh-token sessions",
    post_slug: "custom-php-authentication-guide-for-jwt-and-refresh-token-sessions",
    post_excerpt:
      "A practical article on balancing bearer tokens, cookies, guest routes, and protected author flows in a small custom stack.",
    created_at: "2026-03-23 18:00:00",
    post_status: "published",
  },
  {
    post_id: 1,
    post_title: "Building a compact uploads workflow for authors without bloating the admin UI",
    post_slug: "building-a-compact-uploads-workflow-for-authors-without-bloating-the-admin-ui",
    post_excerpt:
      "An interface-focused look at upload selection, metadata editing, previews, and ownership-aware media management.",
    created_at: "2026-03-21 09:30:00",
    post_status: "published",
  },
];

export default function PostsIndex() {
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const location = useLocation();

  const filteredPosts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) =>
      [post.post_title, post.post_excerpt].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchValue]);

  const isSearchPage = location.pathname === "/blog/search";

  function handleSearchChange(event) {
    const nextValue = event.target.value;

    if (nextValue.length > 100) {
      setSearchError("Search queries cannot be longer than 100 characters.");
      return;
    }

    setSearchError("");
    setSearchValue(nextValue);
  }

  return (
    <>
      <Header />
      <main className="bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <section className="mx-auto w-full max-w-[1280px] px-4 py-12">
          <div className="rounded-[32px] bg-white p-6 shadow-soft md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-4">
                <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Published Posts
                </p>
                <h1 className="text-4xl md:text-5xl">
                  Public blog reading experience
                </h1>
                <p className="max-w-3xl text-base leading-8 text-secondary">
                  This page is prepared for both `GET /api/posts` and
                  `GET /api/posts/search`, so it already has the right surface for
                  featured listing, simple searching, and result cards that link into
                  article detail pages.
                </p>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-secondary">
                  Until API wiring begins, the cards below use seeded content and local
                  filtering only. That keeps the page useful for layout review without
                  pretending the data contract is already active.
                </div>
              </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Search published posts
                </label>
                <Input
                  type="text"
                  placeholder="Search by title or excerpt"
                  classes="rounded-xl border-slate-300 px-4 py-3"
                  aria-invalid={Boolean(searchError)}
                  maxLength={100}
                  validation={{
                    name: "search",
                    value: searchValue,
                    onChange: handleSearchChange,
                  }}
                />
                {searchError && (
                  <p className="mt-2 text-sm text-red-700">{searchError}</p>
                )}
                <p className="mt-3 text-xs leading-6 text-secondary">
                  {isSearchPage
                    ? "This route is reserved for backend-powered search results."
                    : "This route acts as the general published-post index."}
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.post_id}
                className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft"
              >
                <div className="flex flex-1 flex-col">
                  <h2 className="text-2xl leading-snug">
                    {post.post_title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-secondary">
                    {post.post_excerpt}
                  </p>
                  <p className="mt-4 text-sm text-secondary">
                    Published: {post.created_at}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.18em] text-secondary">
                      Read More
                    </span>
                    <ActionButton to={`/blog/${post.post_slug}`} variant="dark">
                      Read post
                    </ActionButton>
                  </div>
                </div>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <div className="rounded-[28px] bg-white p-8 text-center shadow-soft md:col-span-2 xl:col-span-3">
                <h2 className="text-2xl">No matching posts</h2>
                <p className="mt-3 text-sm leading-7 text-secondary">
                  The search UI is in place and can later be connected directly to the
                  backend search endpoint.
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
