import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNotice from "../../components/admin/AdminNotice";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSelect from "../../components/admin/AdminSelect";
import {
  deleteAdminUpload,
  getAdminUploads,
  updateAdminUpload,
} from "../../services/admin";
import { getApiData, getApiErrorMessage, getApiMessage } from "../../lib/api-helpers";

const FILTER_OPTIONS = [
  { value: "all", label: "All Uploads" },
  { value: "missing_alt", label: "Missing Alt Text" },
  { value: "with_caption", label: "With Caption" },
];

function formatBytes(size) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminUploads() {
  const [uploads, setUploads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [editDrafts, setEditDrafts] = useState({});
  const [isSavingId, setIsSavingId] = useState(null);

  const loadUploads = useCallback(async () => {
    setIsLoading(true);
    setRequestError("");

    try {
      const payload = await getAdminUploads({
        page,
        limit: 20,
      });
      const data = getApiData(payload, {});

      setUploads(data.items || []);
      setPagination(data.pagination || null);
    } catch (error) {
      setUploads([]);
      setPagination(null);
      setRequestError(
        getApiErrorMessage(error, "Unable to load admin uploads right now."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  async function handleDelete(id) {
    const shouldDelete = window.confirm(
      "Delete this upload permanently? This also attempts to remove the physical file.",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeletingId(id);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await deleteAdminUpload(id);
      await loadUploads();
      setRequestSuccess(getApiMessage(payload, "Upload deleted successfully."));
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to delete this upload right now."),
      );
    } finally {
      setIsDeletingId(null);
    }
  }

  function handleDraftChange(id, field, value) {
    setEditDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        [field]: value,
      },
    }));
  }

  async function handleSaveMetadata(upload) {
    const draft = editDrafts[upload.id] || {};
    const alt_text = draft.alt_text ?? upload.alt_text ?? "";
    const captions = draft.captions ?? upload.captions ?? "";

    setIsSavingId(upload.id);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminUpload({
        id: upload.id,
        alt_text,
        captions,
      });

      await loadUploads();
      setRequestSuccess(getApiMessage(payload, "Upload updated successfully."));
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this upload right now."),
      );
    } finally {
      setIsSavingId(null);
    }
  }

  const filteredUploads = useMemo(() => {
    if (filter === "missing_alt") {
      return uploads.filter((upload) => !upload.alt_text?.trim());
    }

    if (filter === "with_caption") {
      return uploads.filter((upload) => upload.captions?.trim());
    }

    return uploads;
  }, [filter, uploads]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin Uploads"
        title="Upload management"
        description="Review upload records from the live admin uploads endpoint and remove files when needed."
      />

      {requestError && <AdminNotice tone="error">{requestError}</AdminNotice>}
      {requestSuccess && (
        <AdminNotice tone="success">{requestSuccess}</AdminNotice>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-[240px_140px]">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Filter uploads
            </label>
            <AdminSelect
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              options={FILTER_OPTIONS}
              ariaLabel="Filter uploads"
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
                <th className="px-4 py-3">Upload ID</th>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Alt Text</th>
                <th className="px-4 py-3">Caption</th>
                <th className="px-4 py-3">Save</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {!isLoading &&
                filteredUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td className="px-4 py-3 text-sm text-secondary">#{upload.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {upload.file_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      #{upload.user_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      {formatBytes(upload.file_size)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editDrafts[upload.id]?.alt_text ?? upload.alt_text ?? ""}
                        onChange={(event) =>
                          handleDraftChange(upload.id, "alt_text", event.target.value)
                        }
                        className="w-full min-w-[180px] rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        maxLength={200}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editDrafts[upload.id]?.captions ?? upload.captions ?? ""}
                        onChange={(event) =>
                          handleDraftChange(upload.id, "captions", event.target.value)
                        }
                        className="w-full min-w-[180px] rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        maxLength={200}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isSavingId === upload.id}
                        onClick={() => handleSaveMetadata(upload)}
                      >
                        Save
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isDeletingId === upload.id}
                        onClick={() => handleDelete(upload.id)}
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
            Loading uploads...
          </div>
        )}

        {!isLoading && filteredUploads.length === 0 && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-secondary">
            No uploads were returned for the current view.
          </div>
        )}

        {!isLoading && pagination && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-secondary">
              Total uploads: {pagination.total}
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
