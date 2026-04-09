import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import AdminNotice from "../../components/admin/AdminNotice";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import PostForm from "../../components/PostForm";
import { getApiMessage, getApiErrorMessage } from "../../lib/api-helpers";
import { getAdminPosts, updateAdminPost } from "../../services/admin";

export default function AdminPostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPost() {
      setIsLoading(true);
      setRequestError("");

      try {
        const payload = await getAdminPosts({
          status: "all",
          page: 1,
          limit: 100,
        });

        const post = payload?.data?.items?.find(
          (item) => String(item.post_id) === String(postId),
        );

        if (!isMounted) {
          return;
        }

        if (!post) {
          setRequestError("The selected post could not be found in the admin listing.");
          setPostData(null);
          return;
        }

        setPostData(post);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPostData(null);
        setRequestError(
          getApiErrorMessage(error, "Unable to load this post right now."),
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

  async function handleSubmit(values) {
    setIsSubmitting(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      const payload = await updateAdminPost({
        post_id: Number(postId),
        post_title: values.postTitle || undefined,
        post_body: values.postBody || undefined,
        post_excerpt: values.postExcerpt,
        featured_image: values.featuredImage
          ? Number(values.featuredImage)
          : null,
        post_status: values.postStatus || undefined,
      });

      setRequestSuccess(getApiMessage(payload, "Post updated successfully."));
      window.setTimeout(() => navigate("/admin/posts"), 700);
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to update this post right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin Posts"
        title="Edit post"
        description="Edit post content from the admin endpoint."
        actions={
          <Link
            to="/admin/posts"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            Back to posts
          </Link>
        }
      />

      {requestError && <AdminNotice tone="error">{requestError}</AdminNotice>}
      {requestSuccess && <AdminNotice tone="success">{requestSuccess}</AdminNotice>}

      <PostForm
        formSubmit={handleSubmit}
        submitLabel="Save Admin Changes"
        heading={`Edit post #${postId}`}
        description="Update the title, body, excerpt, featured image id, and publication status."
        requestError=""
        requestSuccess=""
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
    </div>
  );
}
