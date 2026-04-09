import { useEffect, useState } from "react";
import { Link } from "react-router";
import AdminNotice from "../../components/admin/AdminNotice";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSelect, {
  humanizeAdminValue,
} from "../../components/admin/AdminSelect";
import {
  deleteAdminPost,
  getAdminPosts,
  updateAdminPostStatus,
} from "../../services/admin";
import { getApiData, getApiErrorMessage, getApiMessage } from "../../lib/api-helpers";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const POST_STATUS_OPTIONS = ["draft", "published", "archived"].map((value) => ({
  value,
  label: humanizeAdminValue(value),
}));

export default function AdminPosts() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setIsLoading(true);
      setRequestError("");

      try {
        const payload = await getAdminPosts({
          status: statusFilter,
          page,
          limit: 20,
        });
        const data = getApiData(payload, {});

        if (!isMounted) {
          return;
        }

        setPosts(data.items || []);
        setPagination(data.pagination || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPosts([]);
        setPagination(null);
        setRequestError(
          getApiErrorMessage(error, "Unable to load admin posts right now."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [page, statusFilter]);

  async function handleStatusChange(postId, nextStatus) {
    setIsUpdatingId(postId);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminPostStatus({
        post_id: postId,
        post_status: nextStatus,
      });

      setPosts((current) =>
        current.map((post) =>
          post.post_id === postId
            ? { ...post, post_status: nextStatus }
            : post,
        ),
      );
      setRequestSuccess(
        getApiMessage(payload, "Post status updated successfully."),
      );
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this post right now."),
      );
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function handleDelete(postId) {
    const shouldDelete = window.confirm(
      "Delete this post permanently? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeletingId(postId);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await deleteAdminPost(postId);

      setPosts((current) => current.filter((post) => post.post_id !== postId));
      setRequestSuccess(getApiMessage(payload, "Post deleted successfully."));
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to delete this post right now."),
      );
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin Posts"
        title="Post management"
        description="Moderate post statuses and destructive delete actions from the live admin posts endpoints."
      />

      {requestError && <AdminNotice tone="error">{requestError}</AdminNotice>}
      {requestSuccess && (
        <AdminNotice tone="success">{requestSuccess}</AdminNotice>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-[240px_140px]">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Filter by status
            </label>
            <AdminSelect
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              options={STATUS_FILTER_OPTIONS}
              ariaLabel="Filter posts by status"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Current page
            </label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-secondary">
              {pagination ? `${pagination.page} of ${pagination.total_pages || 1}` : "1 of 1"}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                <th className="px-4 py-3">Post ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {!isLoading &&
                posts.map((post) => (
                  <tr key={post.post_id}>
                    <td className="px-4 py-3 text-sm text-secondary">
                      #{post.post_id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {post.post_title}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      {post.post_slug}
                    </td>
                    <td className="px-4 py-3">
                      <AdminSelect
                        value={post.post_status}
                        onChange={(event) =>
                          handleStatusChange(post.post_id, event.target.value)
                        }
                        options={POST_STATUS_OPTIONS}
                        ariaLabel={`Update status for ${post.post_title}`}
                        classes="min-w-[160px]"
                        disabled={isUpdatingId === post.post_id}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/posts/${post.post_id}/edit`}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isDeletingId === post.post_id}
                        onClick={() => handleDelete(post.post_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-secondary">
            Loading posts...
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-secondary">
            No posts were returned for the current filter.
          </div>
        )}

        {!isLoading && pagination && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-secondary">
              Total posts: {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!pagination.has_previous_page}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
