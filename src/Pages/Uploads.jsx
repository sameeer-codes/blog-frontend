import { useCallback, useEffect, useMemo, useState } from "react";
import ActionButton from "../ui/ActionButton";
import Input from "../ui/Input";
import { resolveAssetUrl } from "../lib/api-client";
import {
  getApiData,
  getApiErrorMessage,
  getApiMessage,
} from "../lib/api-helpers";
import {
  deleteUploadById,
  getUploads,
  updateUpload,
  uploadFiles,
} from "../services/uploads";

function formatBytes(size) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadPreview({ upload, large = false }) {
  const previewUrl = resolveAssetUrl(upload?.base_path);

  if (previewUrl) {
    return (
      <div
        className={`grid w-full place-items-center bg-slate-50 ${
          large ? "aspect-[4/3]" : "aspect-square"
        }`}
      >
        <img
          src={previewUrl}
          alt={upload.alt_text || upload.file_name}
          className="max-h-full max-w-full object-contain object-center"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-end bg-[linear-gradient(135deg,_rgba(84,125,214,0.16),_rgba(100,69,191,0.08))] p-5 ${
        large ? "aspect-[4/3]" : "aspect-square"
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Upload Preview
        </p>
        <h3 className="mt-3 text-lg leading-snug text-slate-800">
          {upload.file_name}
        </h3>
      </div>
    </div>
  );
}

export default function Uploads() {
  const [uploads, setUploads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [metadataDraft, setMetadataDraft] = useState({
    alt_text: "",
    captions: "",
  });
  const [metadataError, setMetadataError] = useState("");
  const [metadataSuccess, setMetadataSuccess] = useState("");

  const selectedUpload = useMemo(
    () => uploads.find((upload) => upload.id === selectedUploadId) || null,
    [selectedUploadId, uploads],
  );

  const loadUploads = useCallback(async (page = currentPage) => {
    setIsLoading(true);
    setUploadError("");

    try {
      const payload = await getUploads({
        page,
        limit: 24,
      });
      const data = getApiData(payload, {});
      const nextItems = data.items || [];

      setUploads(nextItems);
      setPagination(data.pagination || null);

      return nextItems;
    } catch (error) {
      setUploads([]);
      setPagination(null);
      setUploadError(
        getApiErrorMessage(error, "Unable to load uploads right now."),
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadUploads(currentPage);
  }, [currentPage, loadUploads]);

  function openUploadModal(upload) {
    setSelectedUploadId(upload.id);
    setMetadataDraft({
      alt_text: upload.alt_text || "",
      captions: upload.captions || "",
    });
  }

  function closeUploadModal() {
    setSelectedUploadId(null);
    setMetadataDraft({
      alt_text: "",
      captions: "",
    });
    setMetadataError("");
    setMetadataSuccess("");
  }

  async function handleFilesChangeEvent(event) {
    const nextFiles = Array.from(event.target.files || []);

    if (nextFiles.length === 0) {
      return;
    }

    setUploadError("");
    setUploadSuccess("");

    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];
    const invalidFile = nextFiles.find(
      (file) =>
        !allowedTypes.includes(file.type) || file.size > 20 * 1024 * 1024,
    );

    if (invalidFile) {
      setUploadError(
        "Only png, jpg, jpeg, webp, and gif files up to 20MB are allowed.",
      );
      event.target.value = "";
      return;
    }

    try {
      const payload = await uploadFiles(nextFiles);
      const results = getApiData(payload, []);
      const successCount = results.filter((item) => item.success).length;
      const failedCount = results.length - successCount;

      setCurrentPage(1);
      const refreshedUploads = await loadUploads(1);

      if (refreshedUploads[0]) {
        openUploadModal(refreshedUploads[0]);
      }

      if (successCount > 0) {
        setUploadSuccess(
          `${successCount} file${successCount === 1 ? "" : "s"} uploaded successfully.${failedCount > 0 ? ` ${failedCount} failed.` : ""}`,
        );
      }

      if (failedCount > 0 && successCount === 0) {
        setUploadError(
          results.find((item) => !item.success)?.message ||
            "No files could be uploaded.",
        );
      }
    } catch (error) {
      setUploadError(
        getApiErrorMessage(error, "Unable to upload files right now."),
      );
    } finally {
      event.target.value = "";
    }
  }

  function handleMetadataChange(event) {
    const { name, value } = event.target;
    setMetadataDraft((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleMetadataSubmit(event) {
    event.preventDefault();

    const nextAltText = metadataDraft.alt_text.trim();
    const nextCaptions = metadataDraft.captions.trim();

    if (!nextAltText && !nextCaptions) {
      setMetadataError("Add alt text or a caption before saving metadata.");
      setMetadataSuccess("");
      return;
    }

    if (nextAltText.length > 200 || nextCaptions.length > 200) {
      setMetadataError("Alt text and captions must be 200 characters or fewer.");
      setMetadataSuccess("");
      return;
    }

    try {
      const payload = await updateUpload({
        id: selectedUploadId,
        alt_text: nextAltText,
        captions: nextCaptions,
      });

      setUploads((current) =>
        current.map((upload) =>
          upload.id === selectedUploadId
            ? {
                ...upload,
                alt_text: nextAltText,
                captions: nextCaptions,
              }
            : upload,
        ),
      );
      setMetadataError("");
      setMetadataSuccess(
        getApiMessage(payload, "Metadata updated successfully."),
      );
    } catch (error) {
      setMetadataSuccess("");
      setMetadataError(
        getApiErrorMessage(error, "Unable to update this upload right now."),
      );
    }
  }

  async function handleDeleteUpload(id) {
    try {
      const payload = await deleteUploadById(id);
      setUploads((current) => current.filter((upload) => upload.id !== id));
      setUploadSuccess(
        getApiMessage(payload, "Upload deleted successfully."),
      );
      closeUploadModal();
    } catch (error) {
      setMetadataError(
        getApiErrorMessage(error, "Unable to delete this upload right now."),
      );
    }
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50">
      <section className="mx-auto w-full max-w-[1280px] px-4 py-12">
        <div className="space-y-3">
          <p className="inline-flex rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Media Library
          </p>
          <h1 className="text-4xl">Upload and manage your image library</h1>
          <p className="max-w-3xl text-base leading-8 text-secondary">
            The uploader lives at the top of the library, and the screen refreshes into
            a grid immediately after files are selected. Clicking any upload opens a
            larger preview with editable metadata beside it.
          </p>
        </div>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl">Uploads grid</h2>
              <p className="mt-2 text-sm leading-7 text-secondary">
                Browse your media, upload new images, and update file details in one place.
              </p>
            </div>
            <ActionButton as="label" htmlFor="files" variant="primary">
              Upload Files
            </ActionButton>
          </div>

          <input
            multiple
            className="hidden"
            type="file"
            name="files"
            id="files"
            accept=".png,.jpg,.jpeg,.webp,.gif"
            onChange={handleFilesChangeEvent}
          />

          {uploadError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-700">
              {uploadSuccess}
            </div>
          )}

          {isLoading && (
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-center text-secondary">
              Loading uploads...
            </div>
          )}

          {!isLoading && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {uploads.map((upload) => (
                <ActionButton
                  key={upload.id}
                  variant="ghost"
                  classes="group !flex !w-full !flex-col !items-stretch overflow-hidden rounded-lg border-slate-200 bg-white p-0 text-left shadow-soft hover:-translate-y-1 hover:border-accent-primary"
                  onClick={() => openUploadModal(upload)}
                >
                  <UploadPreview upload={upload} />
                  <div className="space-y-1 border-t border-slate-100 px-3 py-3">
                    <h3 className="line-clamp-1 text-sm leading-6 text-slate-900">
                      {upload.file_name}
                    </h3>
                    <div className="text-xs leading-5 text-secondary">
                      <p>{upload.mime_type}</p>
                      <p>{formatBytes(upload.file_size)}</p>
                    </div>
                  </div>
                </ActionButton>
              ))}

              {uploads.length === 0 && (
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-center text-secondary sm:col-span-2 lg:col-span-3 xl:col-span-4">
                  No uploads are available yet.
                </div>
              )}
            </div>
          )}

          {pagination && pagination.total_pages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ActionButton
                variant="secondary"
                disabled={!pagination.has_previous_page}
                onClick={() =>
                  setCurrentPage((current) => Math.max(current - 1, 1))
                }
              >
                Previous
              </ActionButton>
              <ActionButton
                variant="dark"
                disabled={!pagination.has_next_page}
                onClick={() =>
                  setCurrentPage((current) =>
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

        {selectedUpload && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
            <div className="max-h-[90vh] w-full max-w-[1100px] overflow-auto rounded-[32px] bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                    Upload Detail
                  </p>
                  <h2 className="mt-2 text-2xl">{selectedUpload.file_name}</h2>
                </div>
                <ActionButton
                  variant="ghost"
                  classes="!px-4 !py-2"
                  onClick={closeUploadModal}
                >
                  Close
                </ActionButton>
              </div>

              <div className="grid gap-8 p-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <UploadPreview upload={selectedUpload} large />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-secondary">
                    <p>ID: {selectedUpload.id}</p>
                    <p>File Size: {formatBytes(selectedUpload.file_size)}</p>
                    <p>MIME Type: {selectedUpload.mime_type}</p>
                    <p>Path: {selectedUpload.base_path}</p>
                  </div>
                </div>

                <form onSubmit={handleMetadataSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-2xl">Edit metadata</h3>
                    <p className="mt-2 text-sm leading-7 text-secondary">
                      Update the text and notes associated with this upload.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Alt text
                    </label>
                    <Input
                      type="text"
                      id="alt_text"
                      placeholder="Describe the image clearly"
                      classes="rounded-xl border-slate-300 px-4 py-3"
                      aria-invalid={Boolean(metadataError)}
                      maxLength={200}
                      validation={{
                        name: "alt_text",
                        value: metadataDraft.alt_text,
                        onChange: handleMetadataChange,
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Caption
                    </label>
                    <textarea
                      name="captions"
                      value={metadataDraft.captions}
                      onChange={handleMetadataChange}
                      placeholder="Write a caption or usage note"
                      maxLength={200}
                      className="min-h-[180px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-accent-primary"
                    />
                  </div>

                  {metadataError && (
                    <p className="text-sm text-red-700">{metadataError}</p>
                  )}

                  {metadataSuccess && (
                    <p className="text-sm text-emerald-700">{metadataSuccess}</p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <ActionButton type="submit" variant="primary">
                      Save Metadata
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleDeleteUpload(selectedUpload.id)}
                    >
                      Delete Upload
                    </ActionButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
