import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import AdminNotice from "../../components/admin/AdminNotice";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSelect, {
  humanizeAdminValue,
} from "../../components/admin/AdminSelect";
import {
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../../services/admin";
import { getApiData, getApiErrorMessage, getApiMessage } from "../../lib/api-helpers";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "blocked", label: "Blocked" },
];

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

export default function AdminUsers() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [isUpdatingRoleId, setIsUpdatingRoleId] = useState(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setRequestError("");

    try {
      const payload = await getAdminUsers({
        status: statusFilter,
        page,
        limit: 20,
      });
      const data = getApiData(payload, {});

      setUsers(data.items || []);
      setPagination(data.pagination || null);
    } catch (error) {
      setUsers([]);
      setPagination(null);
      setRequestError(
        getApiErrorMessage(error, "Unable to load admin users right now."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleStatusChange(userId, nextStatus) {
    setIsUpdatingId(userId);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminUserStatus({
        id: userId,
        status: nextStatus,
      });

      await loadUsers();
      setRequestSuccess(
        getApiMessage(payload, "User status updated successfully."),
      );
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this user right now."),
      );
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function handleRoleChange(userId, nextRole) {
    setIsUpdatingRoleId(userId);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminUserRole({
        id: userId,
        user_role: nextRole,
      });

      await loadUsers();
      setRequestSuccess(getApiMessage(payload, "User role updated successfully."));
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this role right now."),
      );
    } finally {
      setIsUpdatingRoleId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin Users"
        title="User management"
        description="Manage account approval states from the live admin users endpoint."
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
              ariaLabel="Filter users by status"
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
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {!isLoading &&
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm text-secondary">#{user.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {user.username}
                    </td>
                    <td className="px-4 py-3">
                      <AdminSelect
                        value={user.user_role}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value)
                        }
                        options={USER_ROLE_OPTIONS}
                        ariaLabel={`Update role for ${user.username}`}
                        classes="min-w-[140px]"
                        disabled={isUpdatingRoleId === user.id}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <AdminSelect
                        value={user.status}
                        onChange={(event) =>
                          handleStatusChange(user.id, event.target.value)
                        }
                        options={USER_STATUS_OPTIONS}
                        ariaLabel={`Update status for ${user.username}`}
                        classes="min-w-[180px]"
                        disabled={isUpdatingId === user.id}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-secondary">
            Loading users...
          </div>
        )}

        {!isLoading && users.length === 0 && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-secondary">
            No users were returned for the current filter.
          </div>
        )}

        {!isLoading && pagination && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-secondary">
              Total users: {pagination.total}
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
