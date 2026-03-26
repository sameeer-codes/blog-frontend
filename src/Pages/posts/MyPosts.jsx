import { useEffect, useMemo, useState } from "react";
import ActionButton from "../../ui/ActionButton";
import {
  formatApiDate,
  getApiData,
  getApiErrorMessage,
} from "../../lib/api-helpers";
import { getMyPosts } from "../../services/posts";

const statusStyles = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

const filters = [
  { key: "all", label: "All Posts" },
  { key: "draft", label: "Drafts" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

export default function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadMyPosts() {
      setIsLoading(true);
      setRequestError("");

      try {
        const payload = await getMyPosts({
          page,
          limit: 12,
        });
        const data = getApiData(payload, {});

        if (!isMounted) {
          return;
        }

        setMyPosts(data.items || []);
        setPagination(data.pagination || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMyPosts([]);
        setPagination(null);
        setRequestError(
          getApiErrorMessage(
            error,
            "Unable to load your posts right now. Please try again.",
          ),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMyPosts();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") {
      return myPosts;
    }

    return myPosts.filter((post) => post.post_status === activeFilter);
  }, [activeFilter, myPosts]);

  const filterCounts = useMemo(
    () => ({
      all: myPosts.length,
      draft: myPosts.filter((post) => post.post_status === "draft").length,
      published: myPosts.filter((post) => post.post_status === "published").length,
      archived: myPosts.filter((post) => post.post_status === "archived").length,
    }),
    [myPosts],
  );

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
              Review your content in a card grid, then filter by status to focus on
              drafts, published posts, or archived work.
            </p>
          </div>
          <ActionButton to="/post/create" variant="primary">
            Create new post
          </ActionButton>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <ActionButton
                key={filter.key}
                variant={isActive ? "dark" : "secondary"}
                classes="!rounded-xl !px-4 !py-2"
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label} ({filterCounts[filter.key] || 0})
              </ActionButton>
            );
          })}
        </div>

        {requestError && (
          <div className="mb-6 rounded-[28px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
            {requestError}
          </div>
        )}

        {isLoading && (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-soft">
            Loading your posts...
          </div>
        )}

        {!isLoading && (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
              <p>
                Showing {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
                {activeFilter !== "all" ? ` in ${activeFilter}` : ""}.
              </p>
              {pagination && (
                <p>
                  Page {pagination.page} of {pagination.total_pages}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.post_id}
                  className="flex h-full flex-col rounded-[24px] bg-white p-5 shadow-soft"
                >
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

                  <div className="mt-4 flex-1">
                    <h2 className="text-2xl leading-snug">{post.post_title}</h2>
                    <p className="mt-3 text-sm leading-7 text-secondary">
                      {post.post_excerpt}
                    </p>
                  </div>

                  <div className="mt-5 space-y-1 text-sm text-secondary">
                    <p>Created: {formatApiDate(post.created_at)}</p>
                    <p>Updated: {formatApiDate(post.updated_at)}</p>
                    <p className="line-clamp-1">Slug: {post.post_slug}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
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
                </article>
              ))}

              {filteredPosts.length === 0 && (
                <div className="rounded-[28px] bg-white p-8 text-center shadow-soft md:col-span-2 xl:col-span-3">
                  No posts were returned for this filter.
                </div>
              )}
            </div>
          </>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ActionButton
              variant="secondary"
              disabled={!pagination.has_previous_page}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Previous
            </ActionButton>
            <ActionButton
              variant="dark"
              disabled={!pagination.has_next_page}
              onClick={() =>
                setPage((current) =>
                  pagination.total_pages
                    ? Math.min(current + 1, pagination.total_pages)
                    : current + 1,
                )
              }
            >
              Next
            </ActionButton>
          </div>
        )}
      </section>
    </main>
  );
}
