import { useParams } from "react-router";
import PostForm from "../../components/PostForm";
import ActionButton from "../../ui/ActionButton";

const seededBody =
  "Editing a post usually has different stakes than creating one, because authors expect clear state visibility for drafts, published pieces, and archived entries. This scaffold uses the same form component as the create flow, but the surrounding context is tuned for reviewing ownership, post status, and the kind of precise field updates the backend patch endpoint will eventually accept. Keeping these two screens aligned now reduces churn later, especially when handling partial updates, featured image changes, and slug regeneration triggered by title edits.";

export default function EditPost() {
  const { postId } = useParams();

  function handleEdit(values) {
    console.log("Edit post draft", values);
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
          <ActionButton to="/posts/me" variant="secondary" classes="!px-4 !py-2 !font-medium">
            Back to my posts
          </ActionButton>
        </div>

        <PostForm
          formSubmit={handleEdit}
          submitLabel="Save Post Changes"
          heading="Edit post details"
          description="This screen is prepared for `GET /api/posts/me/single` and `PATCH /api/posts`, including ownership-sensitive editing of title, body, excerpt, featured image, and status."
          formdata={{
            postTitle: "Updated custom PHP blog architecture for better maintainability across routes and content workflows",
            postBody: seededBody,
            postExcerpt:
              "An edit-state version of the post form, intended for author-owned content and eventual partial update flows.",
            featuredImage: "11",
            postStatus: "published",
          }}
        />
      </section>
    </main>
  );
}
