import { Controller, useForm } from "react-hook-form";
import TextEditor from "../ui/TextEditor";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import StepOne from "../ui/PostForm/StepOne";
import StepTwo from "../ui/PostForm/StepTwo";

export default function PostForm({ formSubmit, formdata = {} }) {
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

  const steps = [
    {
      fields: ["postTitle", "postContent"],
      component: StepOne,
    },
    {
      fields: [],
      component: StepTwo,
    }
  ];

  const [step, setStep] = useState(0);
  const CurrentStep = steps[step].component;

  const handleNext = async () => {
    const isValid = await trigger(steps[step].fields);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="p-4 flex flex-col max-w-[768px] m-auto rounded-md">
      <h2 className="text-4xl mb-8 mt-4 text-center font-bold">Create Post</h2>
      <form onSubmit={handleSubmit(formSubmit)}>
        <CurrentStep control={control} register={register} errors={errors} />
        {step > 0 && (
          <Button
            children={"Previous"}
            variant={"primary"}
            classes={"float-left min-w-[100px] mt-4 rounded-none"}
            id="prevBtn"
            onClick={handlePrev}
          />
        )}
        {step < steps.length - 1 && (
          <Button
            children={"Next"}
            variant={"primary"}
            classes={"float-right min-w-[100px] mt-4"}
            id="nextBtn"
            onClick={handleNext}
          />
        )}
        {/* <Button type={"submit"} children={"Publish"} classes={"mt-4 w-full"} /> */}
      </form>
    </div>
  );
}
