import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
export default function TextEditor({ value, onChange, modules, formats }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder="Please enter your post content here"
    />
  );
}
