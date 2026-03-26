import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import Header from "../../components/Header";
import Input from "../../ui/Input";
import ActionButton from "../../ui/ActionButton";
import {
  formatApiDate,
  getApiData,
  getApiErrorMessage,
} from "../../lib/api-helpers";
import { getPublicPosts, searchPublicPosts } from "../../services/posts";

export default function PostsIndex() {
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const isFirstLoadRef = useRef(true);
  const location = useLocation();
  const isSearchPage = location.pathname === "/blog/search";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  function handleSearchChange(event) {
    const nextValue = event.target.value;

    if (nextValue.length > 100) {
      setSearchError("Search queries cannot be longer than 100 characters.");
      return;
    }

    setSearchError("");
    setSearchValue(nextValue);
    setPage(1);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      const isInitialLoad = isFirstLoadRef.current;

      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsUpdating(true);
      }
      setRequestError("");

      try {
        const payload = debouncedSearchValue
          ? await searchPublicPosts({
              query: debouncedSearchValue,
              page,
              limit: 9,
            })
          : await getPublicPosts({
              page,
              limit: 9,
            });

        const data = getApiData(payload, {});

        if (!isMounted) {
          return;
        }

        setPosts(data.items || []);
        setPagination(data.pagination || null);
        isFirstLoadRef.current = false;
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPosts([]);
        setPagination(null);
        setRequestError(
          getApiErrorMessage(
            error,
            "Unable to load published posts right now. Please try again.",
          ),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsUpdating(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchValue, page]);

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
                  Browse published writing, search by topic, and move into full article
                  pages without leaving the reading flow.
                </p>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-secondary">
                  Use the search field to narrow the list and find a post faster.
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
                    ? "Search results update as you type."
                    : "Browse the latest published posts."}
                </p>
                {isUpdating && (
                  <p className="mt-2 text-xs leading-6 text-secondary">
                    Updating results...
                  </p>
                )}
              </div>
            </div>
          </div>

          {requestError && (
            <div className="mt-8 rounded-[28px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
              {requestError}
            </div>
          )}

          {isLoading && (
            <div className="mt-8 rounded-[28px] bg-white p-8 text-center shadow-soft">
              Loading published posts...
            </div>
          )}

          {!isLoading && (
            <section className="mt-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
                <p>
                  Showing {posts.length} item{posts.length === 1 ? "" : "s"}
                  {debouncedSearchValue ? ` for "${debouncedSearchValue}"` : ""}.
                </p>
                {pagination && (
                  <p>
                    Page {pagination.page} of {pagination.total_pages}
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.post_id}
                    className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft"
                  >
                    <div className="flex flex-1 flex-col">
                      <h2 className="text-2xl leading-snug">{post.post_title}</h2>
                      <p className="mt-3 flex-1 text-sm leading-7 text-secondary">
                        {post.post_excerpt}
                      </p>
                      <p className="mt-4 text-sm text-secondary">
                        Published: {formatApiDate(post.created_at)}
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

                {posts.length === 0 && (
                  <div className="rounded-[28px] bg-white p-8 text-center shadow-soft md:col-span-2 xl:col-span-3">
                    <h2 className="text-2xl">No matching posts</h2>
                    <p className="mt-3 text-sm leading-7 text-secondary">
                      No posts matched the current search.
                    </p>
                  </div>
                )}
              </div>

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
          )}
        </section>
      </main>
    </>
  );
}
