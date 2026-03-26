import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostForm from "../../components/PostForm";
import ActionButton from "../../ui/ActionButton";
import {
  getApiData,
  getApiErrorMessage,
  getApiMessage,
} from "../../lib/api-helpers";
import { getMyPostById, updatePost } from "../../services/posts";

export default function EditPost() {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPost() {
      setIsLoading(true);
      setRequestError("");

      try {
        const payload = await getMyPostById(postId);
        const data = getApiData(payload, null);

        if (!isMounted) {
          return;
        }

        setPostData(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPostData(null);
        setRequestError(
          getApiErrorMessage(error, "Unable to load this post for editing."),
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
  }, [postId]);

  async function handleEdit(values) {
    setIsSubmitting(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updatePost({
        post_id: Number(postId),
        post_title: values.postTitle || undefined,
        post_body: values.postBody || undefined,
        post_excerpt: values.postExcerpt || undefined,
        featured_image: values.featuredImage
          ? Number(values.featuredImage)
          : null,
        post_status: values.postStatus || undefined,
      });

      setRequestSuccess(
        getApiMessage(payload, "Post updated successfully."),
      );
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this post right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50">
      <section className="mx-auto w-full max-w-[1280px] px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Post #{postId}
            </p>
            <h1 className="mt-2 text-3xl">Edit author-owned post</h1>
          </div>
          <ActionButton
            to="/posts/me"
            variant="secondary"
            classes="!px-4 !py-2 !font-medium"
          >
            Back to my posts
          </ActionButton>
        </div>

        <PostForm
          formSubmit={handleEdit}
          submitLabel="Save Post Changes"
          heading="Edit post details"
          description="Update the post title, body, excerpt, featured image, and publish status from one place."
          requestError={requestError}
          requestSuccess={requestSuccess}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          formdata={{
            postTitle: postData?.post_title || "",
            postBody: postData?.post_content || "",
            postExcerpt: postData?.post_excerpt || "",
            featuredImage: postData?.post_featured_image || "",
            postStatus: postData?.post_status || "draft",
          }}
        />
      </section>
    </main>
  );
}
