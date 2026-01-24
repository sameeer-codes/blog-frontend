import React, { useEffect, useState } from "react";
import { register } from "../../services/auth";
import useApi from "../../hooks/useApi";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { Link, redirect } from "react-router";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";

function Register() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const api = useApi();

  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(false);

  const submitRegister = async (data) => {
    setLoading(true);
    console.log("Submit triggered");
    const registerData = data;

    try {
      const response = await api.post("/auth/register", registerData);
      if (response) {
        setLoading(false);
        redirect("/auth/login");
      }
    } catch (e) {
      if (e.response.data.code === 409) {
        setRequestError("Account already exists, please try login,");
      } else if (e.response.data.code === 403) {
        setRequestError("Already logged in.");
      } else {
        setRequestError(
          "There was an error creating your account please try again later.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-full grid place-items-center  bg-gray-200 p-4">
        <div className="absolute top-4 left-4 text-blue-900">
          <Link to={"/"} className="flex gap-2 items-center">
            <BiArrowBack /> Back to Home
          </Link>
        </div>
        <form
          className="flex flex-col w-full max-w-100 p-8  bg-white rounded-md gap-4 shadow-md"
          onSubmit={loading ? handleSubmit() : handleSubmit(submitRegister)}
        >
          <h2 className="text-center text-4xl font-medium mb-4 pb-4 border-b-2 border-b-blue-700">
            Register
          </h2>
          <Input
            type={"text"}
            placeholder={"Enter your Username"}
            validation={{
              ...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "A username must be at least 3 characters long",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Usernames can only contain letters, numbers, and underscores",
                },
                maxLength: {
                  value: 16,
                  message: "A username cannot be longer than 16 characters",
                },
              }),
            }}
          />
          {errors.username && (
            <p className="text-red-700 text-sm">{errors.username.message}</p>
          )}
          <Input
            type="email"
            placeholder="Enter your Email"
            validation={{
              ...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Please enter a valid email",
                },
              }),
            }}
          />
          {errors.email && (
            <p className="text-red-700 text-sm">{errors.email.message}</p>
          )}
          <Input
            type="password"
            placeholder={"Enter your Password"}
            validation={{
              ...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 8,
                  message: "Passwords must be atleast 8 characters long",
                },
                maxLength: {
                  value: 16,
                  message: "Passwords can not be longer than 16 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                  message:
                    "Password must contain at least One lower case, One upper case and one special character and a number",
                },
              }),
            }}
          />
          {errors.password && (
            <p className="text-red-700 text-sm">{errors.password.message}</p>
          )}

          {requestError && (
            <p className="text-red-700 text-sm">{requestError}</p>
          )}
          <p className="text-sm">
            By Signing up, you agree to our privacy policy and terms and
            conditions.
          </p>
          <Button type={"submit"} children={"Register Now"} />
        </form>
      </div>
    </>
  );
}

export default Register;
