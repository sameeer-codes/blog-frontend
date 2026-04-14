import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import AdminNotice from "../../components/admin/AdminNotice";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSelect, {
  humanizeAdminValue,
} from "../../components/admin/AdminSelect";
import { getApiData, getApiErrorMessage, getApiMessage } from "../../lib/api-helpers";
import {
  getAdminUserById,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../../services/admin";

const USER_STATUS_OPTIONS = ["pending_approval", "approved", "blocked"].map(
  (value) => ({
    value,
    label: humanizeAdminValue(value),
  }),
);

const USER_ROLE_OPTIONS = ["author", "admin"].map((value) => ({
  value,
  label: humanizeAdminValue(value),
}));

export default function AdminUserDetails() {
  const { userId } = useParams();
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);

  const loadUserDetails = useCallback(async () => {
    setIsLoading(true);
    setRequestError("");

    try {
      const payload = await getAdminUserById(Number(userId));
      const data = getApiData(payload, null);

      setDetails(data);
    } catch (error) {
      setDetails(null);
      setRequestError(
        getApiErrorMessage(error, "Unable to load this user right now."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUserDetails();
  }, [loadUserDetails]);

  async function handleStatusChange(nextStatus) {
    if (!details?.user) {
      return;
    }

    setIsSavingStatus(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminUserStatus({
        id: details.user.id,
        status: nextStatus,
      });

      await loadUserDetails();
      setRequestSuccess(getApiMessage(payload, "User status updated successfully."));
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this user right now."),
      );
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleRoleChange(nextRole) {
    if (!details?.user) {
      return;
    }

    setIsSavingRole(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminUserRole({
        id: details.user.id,
        user_role: nextRole,
      });

      await loadUserDetails();
      setRequestSuccess(getApiMessage(payload, "User role updated successfully."));
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this role right now."),
      );
    } finally {
      setIsSavingRole(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin Users"
        title="User details"
        description="Review one user alongside their posts and uploads."
        actions={
          <Link
            to="/admin/users"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            Back to users
          </Link>
        }
      />

      {requestError && <AdminNotice tone="error">{requestError}</AdminNotice>}
      {requestSuccess && <AdminNotice tone="success">{requestSuccess}</AdminNotice>}

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-secondary">
          Loading user details...
        </div>
      )}

      {!isLoading && details && (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                User ID
              </p>
              <p className="mt-2 text-2xl">#{details.user.id}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Username
              </p>
              <p className="mt-2 text-2xl">{details.user.username}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Posts
              </p>
              <p className="mt-2 text-2xl">{details.stats?.posts_count || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Uploads
              </p>
              <p className="mt-2 text-2xl">{details.stats?.uploads_count || 0}</p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Email
                  </p>
                  <p className="mt-2 text-sm text-slate-900">{details.user.email}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                      Role
                    </label>
                    <AdminSelect
                      value={details.user.user_role}
                      onChange={(event) => handleRoleChange(event.target.value)}
                      options={USER_ROLE_OPTIONS}
                      ariaLabel="Update user role"
                      disabled={isSavingRole}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                      Status
                    </label>
                    <AdminSelect
                      value={details.user.status}
                      onChange={(event) => handleStatusChange(event.target.value)}
                      options={USER_STATUS_OPTIONS}
                      ariaLabel="Update user status"
                      disabled={isSavingStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Account timestamps
              </p>
              <div className="mt-4 space-y-3 text-sm text-secondary">
                <p>Created: {details.user.created_at}</p>
                <p>Updated: {details.user.updated_at}</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-xl">Posts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(details.posts || []).map((post) => (
                      <tr key={post.post_id}>
                        <td className="px-4 py-3 text-sm text-secondary">#{post.post_id}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {post.post_title}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary">
                          {humanizeAdminValue(post.post_status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(details.posts || []).length === 0 && (
                <div className="px-4 py-6 text-sm text-secondary">
                  No posts found for this user.
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-xl">Uploads</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">File</th>
                      <th className="px-4 py-3">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(details.uploads || []).map((upload) => (
                      <tr key={upload.id}>
                        <td className="px-4 py-3 text-sm text-secondary">#{upload.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {upload.file_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary">
                          {upload.mime_type || "Unknown"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(details.uploads || []).length === 0 && (
                <div className="px-4 py-6 text-sm text-secondary">
                  No uploads found for this user.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
