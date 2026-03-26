import PostForm from "../../components/PostForm";

const initialBody =
  "This frontend draft editor is intentionally seeded with enough realistic filler content to reflect the backend validation rules that expect a substantial post body. It gives the interface the right proportions for long-form writing, excerpt generation, featured image assignment, and status selection. Once the backend integration begins, this seed content can be replaced by user-entered data, but for now it serves as a structural stand-in for a real article body that would satisfy the current minimum length requirement used by the API during post creation flows.";

export default function CreatePost() {
  function submitHandle(formValues) {
    console.log("Create post draft", formValues);
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50">
      <section className="mx-auto flex w-full max-w-[1280px] px-4 py-12">
        <PostForm
          formSubmit={submitHandle}
          submitLabel="Create Post Draft"
          heading="Create a new post"
          description="This screen is prepared for `POST /api/posts` and mirrors the field names and validation constraints described by the backend README."
          formdata={{
            postTitle: "How I would structure a clean frontend around a custom blog API contract",
            postBody: initialBody,
            postExcerpt:
              "A preparation-focused editor screen that matches the backend contract and gives the blog frontend the right authoring surface before API wiring begins.",
            featuredImage: "12",
            postStatus: "draft",
          }}
        />
      </section>
    </main>
  );
}
