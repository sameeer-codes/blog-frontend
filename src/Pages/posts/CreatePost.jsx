import { useState } from "react";
import { useNavigate } from "react-router";
import PostForm from "../../components/PostForm";
import { getApiErrorMessage, getApiMessage } from "../../lib/api-helpers";
import { createPost } from "../../services/posts";

export default function CreatePost() {
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function submitHandle(formValues) {
    setIsSubmitting(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await createPost({
        post_title: formValues.postTitle,
        post_body: formValues.postBody,
        post_excerpt: formValues.postExcerpt || undefined,
        featured_image: formValues.featuredImage
          ? Number(formValues.featuredImage)
          : undefined,
        post_status: formValues.postStatus,
      });

      setRequestSuccess(
        getApiMessage(payload, "Post created successfully."),
      );

      window.setTimeout(() => {
        navigate("/posts/me");
      }, 900);
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to create this post right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50">
      <section className="mx-auto flex w-full max-w-[1280px] px-4 py-12">
        <PostForm
          formSubmit={submitHandle}
          submitLabel="Create Post Draft"
          heading="Create a new post"
          description="Write a new article, choose a featured image, and save it in the status you need."
          requestError={requestError}
          requestSuccess={requestSuccess}
          isSubmitting={isSubmitting}
          formdata={{
            postStatus: "draft",
          }}
        />
      </section>
    </main>
  );
}
