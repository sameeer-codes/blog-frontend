import { useEffect, useState } from "react";
import axios from "axios";
import useApi from "../hooks/useApi";
import Button from "../ui/Button";

export default function Uploads() {
  const [files, setfiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(
    function () {
      console.log("The Files Have been updated");
      console.log(files);
    },
    [files]
  );

  function handlefilesChangeEvent(event) {
    const newFiles = Array.from(event.target.files);
    setfiles(newFiles);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please input a file first");
      return;
    }

    const formdata = new FormData();
    files.forEach((file) => {
      console.log(file);
      formdata.append("files[]", file);
    });
    try {
      const response = await api.post("/uploads/add", formdata, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(percent);
          setProgress(percent);
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }
  return (
    <>
      <div className="bg-gray-300 min-h-[100vh] flex p-4 flex-col items-center justify-center gap-8">
        <form
          className="lg:min-w-[768px] max-w-[768px] bg-white md:p-6  p-4 flex flex-col rounded-md"
          onSubmit={handleUpload}
        >
          <h2 className="my-2 mb-4 font-medium text-2xl text-center">
            Please Upload Your Files
          </h2>
          <input
            multiple
            className="bg-gray-200 p-2"
            type="file"
            name="files"
            placeholder="Please select an image"
            id="files"
            onChange={handlefilesChangeEvent}
          />
          <div className="max-w-[768px] grid md:grid-cols-2 grid-cols-1 gap-4 my-4">
            {files &&
              files.map((file, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full max-h-[446px] h-full object-cover object-center border border-blue-300 rounded-sm"
                  />
                </div>
              ))}
          </div>
          <Button type={"submit"} variant={"primary"} children={"Upload"} />
          {error && (
            <div className="text-red-700 mt-4">
              There was an error uploading the files, please try again
            </div>
          )}
        </form>
      </div>
    </>
  );
}
