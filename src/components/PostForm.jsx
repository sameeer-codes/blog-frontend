import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import ActionButton from "../ui/ActionButton";
import { resolveAssetUrl } from "../lib/api-client";
import useUploadsLibrary from "../hooks/useUploadsLibrary";

function formatBytes(size) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function findMatchingUpload(uploads, featuredImageValue) {
  if (!featuredImageValue) {
    return null;
  }

  const normalizedValue = String(featuredImageValue).trim();

  return (
    uploads.find((upload) => {
      const uploadId = String(upload.id);
      const uploadPath = String(upload.base_path || "");
      const resolvedUploadPath = resolveAssetUrl(upload.base_path);

      return (
        normalizedValue === uploadId ||
        normalizedValue === uploadPath ||
        normalizedValue === resolvedUploadPath
      );
    }) || null
  );
}

function UploadTilePreview({ upload, large = false }) {
  const previewUrl = resolveAssetUrl(upload.base_path);

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
          Upload
        </p>
        <h3 className="mt-3 text-lg leading-snug text-slate-800">
          {upload.file_name}
        </h3>
      </div>
    </div>
  );
}

export default function PostForm({
  formSubmit,
  formdata = {},
  submitLabel = "Save Post",
  heading = "Post Editor",
  description = "Prepare title, body, excerpt, featured image, and publishing state.",
  requestError = "",
  requestSuccess = "",
  isSubmitting = false,
  isLoading = false,
}) {
  const initialPostTitle = formdata.postTitle || "";
  const initialPostBody = formdata.postBody || "";
  const initialPostExcerpt = formdata.postExcerpt || "";
  const initialFeaturedImage = formdata.featuredImage || "";
  const initialPostStatus = formdata.postStatus || "draft";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      postTitle: initialPostTitle,
      postBody: initialPostBody,
      postExcerpt: initialPostExcerpt,
      featuredImage: initialFeaturedImage,
      postStatus: initialPostStatus,
    },
  });

  useEffect(() => {
    reset({
      postTitle: initialPostTitle,
      postBody: initialPostBody,
      postExcerpt: initialPostExcerpt,
      featuredImage: initialFeaturedImage,
      postStatus: initialPostStatus,
    });
  }, [
    initialFeaturedImage,
    initialPostBody,
    initialPostExcerpt,
    initialPostStatus,
    initialPostTitle,
    reset,
  ]);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState("");
  const {
    uploads: availableUploads,
    isLoading: isUploadsLoading,
    error: uploadsError,
    reload: reloadUploads,
  } = useUploadsLibrary();

  const selectedFeaturedImageId = watch("featuredImage");
  const selectedFeaturedImage = useMemo(
    () => findMatchingUpload(availableUploads, selectedFeaturedImageId),
    [availableUploads, selectedFeaturedImageId],
  );

  useEffect(() => {
    if (!selectedFeaturedImageId || availableUploads.length === 0) {
      return;
    }

    const matchedUpload = findMatchingUpload(
      availableUploads,
      selectedFeaturedImageId,
    );

    if (
      matchedUpload &&
      String(selectedFeaturedImageId) !== String(matchedUpload.id)
    ) {
      setValue("featuredImage", String(matchedUpload.id), {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [availableUploads, selectedFeaturedImageId, setValue]);

  function handleSelectFeaturedImage(uploadId) {
    setValue("featuredImage", String(uploadId), {
      shouldDirty: true,
      shouldTouch: true,
    });
    setPickerError("");
    setIsPickerOpen(false);
  }

  function handleClearFeaturedImage() {
    setValue("featuredImage", "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setPickerError("");
  }

  function handleOpenPicker() {
    if (availableUploads.length === 0) {
      setPickerError(
        "No uploads are available yet. Add media first, then select a featured image.",
      );
      return;
    }

    setPickerError("");
    setIsPickerOpen(true);
  }

  return (
    <div className="w-full rounded-[32px] bg-white p-6 shadow-soft md:p-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-4xl">{heading}</h1>
        <p className="max-w-3xl text-base leading-8 text-secondary">
          {description}
        </p>
      </div>

      {requestError && (
        <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
          {requestError}
        </div>
      )}

      {requestSuccess && (
        <div className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-700">
          {requestSuccess}
        </div>
      )}

      {isLoading && (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-8 text-center text-secondary">
          Loading post editor...
        </div>
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Post Title
                </label>
                <Input
                  placeholder="Write a strong, descriptive title"
                  classes="rounded-xl border-slate-300 px-4 py-3 text-lg"
                  validation={{
                    ...register("postTitle", {
                      required: "Post title is required",
                      minLength: {
                        value: 30,
                        message: "Title should be at least 30 characters long",
                      },
                      maxLength: {
                        value: 200,
                        message: "Title cannot be longer than 200 characters",
                      },
                    }),
                  }}
                />
                {errors.postTitle && (
                  <p className="mt-2 text-sm text-red-700">
                    {errors.postTitle.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">
                  Post Body
                </label>
                <textarea
                  {...register("postBody", {
                    required: "Post body is required",
                    minLength: {
                      value: 500,
                      message: "Body should be at least 500 characters long",
                    },
                    maxLength: {
                      value: 4999,
                      message: "Body cannot be longer than 4999 characters",
                    },
                  })}
                  placeholder="Write the main article content here"
                  className="min-h-[620px] w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-accent-primary"
                />
                {errors.postBody && (
                  <p className="mt-2 text-sm text-red-700">
                    {errors.postBody.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Excerpt
                    </label>
                    <textarea
                      {...register("postExcerpt", {
                        minLength: {
                          value: 100,
                          message: "Excerpt should be at least 100 characters long",
                        },
                        maxLength: {
                          value: 299,
                          message: "Excerpt cannot be longer than 299 characters",
                        },
                      })}
                      placeholder="Optional summary for previews and cards"
                      className="min-h-[140px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-accent-primary"
                    />
                    {errors.postExcerpt && (
                      <p className="mt-2 text-sm text-red-700">
                        {errors.postExcerpt.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Featured Image
                    </label>
                    <input type="hidden" {...register("featuredImage")} />

                    <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                      {selectedFeaturedImage ? (
                        <div className="space-y-4">
                          <UploadTilePreview upload={selectedFeaturedImage} />
                          <div className="space-y-2 text-sm text-secondary">
                            <p>{selectedFeaturedImage.file_name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm leading-7 text-secondary">
                          No featured image selected yet. Choose one from your uploads.
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <ActionButton
                          variant="dark"
                          classes="!px-4 !py-3"
                          onClick={handleOpenPicker}
                        >
                          Choose From Uploads
                        </ActionButton>
                        {selectedFeaturedImage && (
                          <ActionButton
                            variant="ghost"
                            classes="!px-4 !py-3"
                            onClick={handleClearFeaturedImage}
                          >
                            Remove Selection
                          </ActionButton>
                        )}
                      </div>
                      {uploadsError && (
                        <p className="mt-3 text-sm text-red-700">{uploadsError}</p>
                      )}
                      {pickerError && (
                        <p className="mt-3 text-sm text-red-700">{pickerError}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Post Status
                    </label>
                    <select
                      {...register("postStatus", {
                        required: "Post status is required",
                      })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-accent-primary"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <ActionButton
                    type="submit"
                    variant="dark"
                    classes="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : submitLabel}
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {isPickerOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="max-h-[90vh] w-full max-w-[1080px] overflow-auto rounded-[32px] bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Upload Picker
                </p>
                <h2 className="mt-2 text-2xl">Select a featured image</h2>
              </div>
              <ActionButton
                variant="ghost"
                classes="!px-4 !py-2"
                onClick={() => setIsPickerOpen(false)}
              >
                Close
              </ActionButton>
            </div>

            <div className="p-6">
              <p className="mb-6 max-w-3xl text-sm leading-7 text-secondary">
                Choose a featured image from your uploads library.
              </p>

              {isUploadsLoading && (
                <div className="mb-5 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-secondary">
                  Loading uploads...
                </div>
              )}

              {uploadsError && (
                <div className="mb-5 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
                  {uploadsError}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {availableUploads.map((upload) => {
                  const isSelected =
                    String(upload.id) === String(selectedFeaturedImageId);

                  return (
                    <ActionButton
                      key={upload.id}
                      variant="ghost"
                      classes={`!flex !w-full !flex-col !items-stretch overflow-hidden rounded-lg bg-white p-0 text-left shadow-soft hover:-translate-y-1 ${
                        isSelected
                          ? "border-accent-primary ring-2 ring-blue-200"
                          : "border-slate-200"
                      }`}
                      onClick={() => handleSelectFeaturedImage(upload.id)}
                    >
                      <UploadTilePreview upload={upload} />
                      <div className="space-y-1 border-t border-slate-100 px-3 py-3">
                        <h3 className="line-clamp-1 text-sm leading-6 text-slate-900">
                          {upload.file_name}
                        </h3>
                        <div className="text-xs leading-5 text-secondary">
                          <p>{formatBytes(upload.file_size)}</p>
                          <p>{upload.mime_type}</p>
                        </div>
                      </div>
                    </ActionButton>
                  );
                })}
              </div>

              {!isUploadsLoading && availableUploads.length === 0 && (
                <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-secondary">
                  No uploads are available yet.
                  <div className="mt-4">
                    <ActionButton variant="secondary" onClick={reloadUploads}>
                      Retry
                    </ActionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
