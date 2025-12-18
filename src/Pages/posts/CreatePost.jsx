import PostForm from "../../components/PostForm";

export default function CreatePost() {
  function submitHandle(e) {
    console.log(e);
  }
  return (
    <>
      <PostForm
        formSubmit={submitHandle}
        formdata={{
          postTitle: "Hello World",
          postContent: "Hello World",
        }}
      />
    </>
  );
}
