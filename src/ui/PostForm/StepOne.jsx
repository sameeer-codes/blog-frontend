import { Controller } from "react-hook-form";
import Input from "../Input";
import TextEditor from "../TextEditor";
import isQuillEmpty from "../../utils/quilempty";

export default function StepOne({ register, control, errors }) {
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
    <>
      <div>
        <label htmlFor="postTitle" className="font-medium text-xl">
          Post Title:
        </label>
        <Input
          placeholder={"Enter your post Title"}
          type="text"
          id={"postTitle"}
          validation={{
            ...register("postTitle", { required: "Title is required" }),
          }}
          classes={"mt-2"}
        />
        {errors.postTitle && (
          <p style={{ color: "red" }}>{errors.postTitle.message}</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p className="font-medium text-xl">Post Content: </p>
        <Controller
          name="postContent"
          control={control}
          rules={{
            required: "Content is required",
            validate: (value) => !isQuillEmpty(value) || "Content is required",
          }}
          render={({ field, fieldState }) => (
            <>
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                modules={modules}
                formats={formats}
                classes={"mt-2"}
              />
              {fieldState.error && (
                <p style={{ color: "red" }}>{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>
    </>
  );
}
