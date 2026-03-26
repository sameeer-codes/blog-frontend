import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import ActionButton from "../ui/ActionButton";

const availableUploads = [
  {
    id: 12,
    file_name: "api-architecture-cover.webp",
    base_path: "/uploads/api-architecture-cover.webp",
    mime_type: "image/webp",
    file_size: 624000,
    alt_text: "A dark architectural mockup for a backend article",
    captions: "Cover image prepared for the architecture series",
  },
  {
    id: 11,
    file_name: "editor-workflow.png",
    base_path: "/uploads/editor-workflow.png",
    mime_type: "image/png",
    file_size: 412000,
    alt_text: "An editor dashboard concept with content blocks",
    captions: "Useful for editor and admin interface previews",
  },
  {
    id: 8,
    file_name: "reader-journey-cover.jpg",
    base_path: "/uploads/reader-journey-cover.jpg",
    mime_type: "image/jpeg",
    file_size: 548000,
    alt_text: "A reader journey illustration for a blog cover",
    captions: "Prepared for editorial and reader-focused articles",
  },
];

function formatBytes(size) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadTilePreview({ upload, large = false }) {
  return (
    <div
      className={`flex w-full items-end rounded-[24px] bg-[linear-gradient(135deg,_rgba(84,125,214,0.16),_rgba(100,69,191,0.08))] p-5 ${
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
}) {
  const {
    postTitle,
    postBody,
    postExcerpt,
    featuredImage,
    postStatus,
  } = formdata;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      postTitle: postTitle || "",
      postBody: postBody || "",
      postExcerpt: postExcerpt || "",
      featuredImage: featuredImage || "",
      postStatus: postStatus || "draft",
    },
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState("");
  const selectedFeaturedImageId = watch("featuredImage");
  const selectedFeaturedImage = useMemo(
    () =>
      availableUploads.find(
        (upload) => String(upload.id) === String(selectedFeaturedImageId),
      ) || null,
    [selectedFeaturedImageId],
  );

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
      setPickerError("No uploads are available yet. Add media first, then select a featured image.");
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
                        No featured image selected yet. Choose one from the existing uploads library.
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <ActionButton variant="dark" classes="!px-4 !py-3" onClick={handleOpenPicker}>
                        Choose From Uploads
                      </ActionButton>
                      {selectedFeaturedImage && (
                        <ActionButton variant="ghost" classes="!px-4 !py-3" onClick={handleClearFeaturedImage}>
                          Remove Selection
                        </ActionButton>
                      )}
                    </div>
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

                <ActionButton type="submit" variant="dark" classes="w-full">
                  {submitLabel}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </form>

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
                This picker uses the admin&apos;s uploads library. Selecting an image stores
                that upload&apos;s integer ID in the form so the eventual API payload still sends
                the correct `featuredImage` value.
              </p>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {availableUploads.map((upload) => {
                  const isSelected =
                    String(upload.id) === String(selectedFeaturedImageId);

                  return (
                    <ActionButton
                      key={upload.id}
                      variant="ghost"
                      classes={`block overflow-hidden rounded-[28px] bg-white p-0 text-left shadow-soft hover:-translate-y-1 ${
                        isSelected
                          ? "border-accent-primary ring-2 ring-blue-200"
                          : "border-slate-200"
                      }`}
                      onClick={() => handleSelectFeaturedImage(upload.id)}
                    >
                      <UploadTilePreview upload={upload} />
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-2 text-base leading-7">
                            {upload.file_name}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-secondary">
                            #{upload.id}
                          </span>
                        </div>
                        <div className="text-sm leading-7 text-secondary">
                          <p>{formatBytes(upload.file_size)}</p>
                          <p>{upload.mime_type}</p>
                        </div>
                      </div>
                    </ActionButton>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
