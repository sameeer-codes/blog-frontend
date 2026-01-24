import { Controller, useForm } from "react-hook-form";
import TextEditor from "../ui/TextEditor";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useEffect, useState } from "react";

export default function PostForm({ className, formSubmit, formdata = {} }) {
  const { postTitle, postContent } = formdata;

  const {
    control,
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      postTitle: postTitle || " ",
      postContent: postContent || " ",
    },
  });

  return (
    <div className={`p-4 flex flex-col m-auto rounded-md ${className}`}>
      <h2 className="text-4xl mb-8 mt-4 text-center font-bold">Create Post</h2>
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="">
          <label htmlFor="postTitle">Post Title:</label>
          <Input validation={{ ...register("postTitle") }} />
        </div>
        <div className="mt-4">
          <label htmlFor="postFeaturedImage">Post Featured Image URL:</label>
          <Input validation={{ ...register("postFeaturedImage") }} />
        </div>
        <div className="mt-4">
          <label htmlFor="postStatus">Post Status:</label>
          <select {...register("postStatus")}>
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="postContent">Post Content:</label>
          <textarea
            {...register("postContent")}
            className="w-full p-2 border-solid border-[1px] border-gray-300 rounded-sm min-h-[46vh] resize-none overflow-y-scroll"
          ></textarea>
        </div>
        <div className="mt-4">
          <label htmlFor="postTitle">Post Excerpt:</label>
          <textarea
            {...register("postExcerpt")}
            className="w-full p-2 border-solid border-[1px] border-gray-300 rounded-sm min-h-[6vh] resize-none overflow-y-scroll"
          ></textarea>
        </div>
        <Button
          type={"submit"}
          children={"Submit"}
          variant={"primary"}
          classes={"float-right min-w-[100px] mt-4"}
        />
      </form>
    </div>
  );
}
