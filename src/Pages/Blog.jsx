import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Header from "../components/Header";
import { resolveAssetUrl } from "../lib/api-client";
import {
  formatApiDate,
  getApiData,
  getApiErrorMessage,
} from "../lib/api-helpers";
import { getPublicPostBySlug, getPublicPosts } from "../services/posts";

export default function Blog() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPost() {
      setIsLoading(true);
      setRequestError("");

      try {
        const [postPayload, relatedPayload] = await Promise.all([
          getPublicPostBySlug(slug),
          getPublicPosts({ page: 1, limit: 3 }),
        ]);

        if (!isMounted) {
          return;
        }

        const currentPost = getApiData(postPayload, null);
        const relatedData = getApiData(relatedPayload, {});

        setPost(currentPost);
        setRelatedPosts(
          (relatedData.items || []).filter(
            (item) => item.post_slug !== currentPost?.post_slug,
          ),
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPost(null);
        setRelatedPosts([]);
        setRequestError(
          getApiErrorMessage(
            error,
            "Unable to load this article right now. Please try again.",
          ),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const featuredImageUrl = resolveAssetUrl(post?.post_featured_image);

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
              <span className="capitalize">{post?.post_title || "Article"}</span>
            </div>

            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Published Article
              </p>
              <h1 className="max-w-3xl text-4xl leading-tight md:text-5xl">
                {post?.post_title || "Article"}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-secondary">
                {post?.post_excerpt ||
                  "Read the full article below."}
              </p>
            </div>

            {requestError && (
              <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
                {requestError}
              </div>
            )}

            {isLoading && (
              <div className="my-10 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-secondary">
                Loading article...
              </div>
            )}

            {!isLoading && post && (
              <>
                {featuredImageUrl && (
                  <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                    <img
                      src={featuredImageUrl}
                      alt={post.post_title}
                      className="aspect-[16/8] w-full object-cover object-center"
                    />
                  </div>
                )}

                <div className="my-10 rounded-[28px] border border-slate-200 bg-slate-50 p-8">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                    <span>Published {formatApiDate(post.created_at)}</span>
                    <span>Status: {post.post_status}</span>
                  </div>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700">
                    A clean reading layout keeps the focus on the article itself.
                  </p>
                </div>

                <article className="max-w-none">
                  <div className="space-y-6 text-base leading-8 text-slate-700">
                    {post.post_content
                      .split(/\n{2,}/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={`${post.post_id}-${index}`}>{paragraph}</p>
                      ))}
                  </div>
                </article>
              </>
            )}
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl">Related reading</h2>
              <Link to="/blog" className="text-sm font-semibold text-accent-primary">
                View all posts
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.post_id}
                  to={`/blog/${relatedPost.post_slug}`}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft hover:border-accent-primary"
                >
                  <h3 className="text-lg capitalize">{relatedPost.post_title}</h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">
                    {relatedPost.post_excerpt}
                  </p>
                </Link>
              ))}

              {!isLoading && relatedPosts.length === 0 && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-7 text-secondary shadow-soft md:col-span-3">
                  No related posts were returned for this view.
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
