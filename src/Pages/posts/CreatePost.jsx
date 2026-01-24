import PostForm from "../../components/PostForm";

export default function CreatePost() {
  function submitHandle(e) {
    console.log(e);
  }
  return (
    <>
      <div className="flex">
        <PostForm
          formSubmit={submitHandle}
          formdata={{
            postTitle: "Hello World",
            postContent: "Hello World",
          }}
          className={"w-full p-8"}
        />
      </div>
    </>
  );
}
