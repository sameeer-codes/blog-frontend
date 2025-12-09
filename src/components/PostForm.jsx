import { Controller, useForm } from "react-hook-form";
import TextEditor from "../ui/TextEditor";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PostForm({ formSubmit, formdata = {} }) {
  const { postTitle, postBody } = formdata;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      postTitle: postTitle || " ",
      content: postBody || " ",
    },
  });

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ];

  const modules = { toolbar: toolbarOptions };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "blockquote",
    "code-block",
    "link",
  ];

  return (
    <div className="p-4 flex flex-col max-w-[768px] m-auto rounded-md">
      <form onSubmit={handleSubmit(formSubmit)}>
        <div>
          <Input
            type="text"
            id={"postTitle"}
            placeholder="Enter your post Title"
            validation={{
              ...register("postTitle", { required: "Title is required" }),
            }}
          />
          {errors.postTitle && (
            <p style={{ color: "red" }}>{errors.postTitle.message}</p>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field, fieldState }) => (
              <>
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  modules={modules}
                  formats={formats}
                />
                {fieldState.error && (
                  <p style={{ color: "red" }}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <Button
          type={"submit"}
          children={"Publish"}
          className={"mt-4 w-full"}
        />
      </form>
    </div>
  );
}
