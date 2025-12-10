import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { AuthContext } from "../../stores/AuthContext";
import useApi from "../../hooks/useApi";
import Input from "../../ui/Input";

function Login() {
  const [token, setToken] = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const api = useApi();

  async function handleLogin(data) {
    const loginData = data;
    console.log(data);
    reset();
    return data;

    const response = api.post("/auth/login", loginData);

    if (response.status === "success") {
      const { data } = response;
      setToken(data.jwt);
    } else {
      console.log(response);
    }
  }

  return (
    <>
      <div className="h-screen w-full grid place-items-center  bg-gray-200 p-4">
        <form
          className="flex flex-col w-full max-w-100 p-8  bg-white rounded-md gap-4 shadow-md"
          onSubmit={handleSubmit(handleLogin)}
        >
          <h2 className="text-center text-4xl font-medium mb-4 pb-4 border-b-2 border-b-blue-700">
            Log in
          </h2>
          <Input
            type={"email"}
            validation={{
              ...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Please enter a valid email",
                },
              }),
            }}
            placeholder={"Enter your Email"}
          />
          {errors.email && (
            <p className="text-red-700 text-sm">{errors.email.message}</p>
          )}
          <Input
            type="password"
            validation={{
              ...register("password", {
                required: "Please enter your password",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                  message:
                    "Password must contain at least one lower case, upper case and one special character and number",
                },
              }),
            }}
            placeholder="Enter your Password"
          />
          {errors.password && (
            <p className="text-red-700 text-sm">{errors.password.message}</p>
          )}
          <div>
            <Button children={"Forgot Password"} variant={"link"} />
          </div>
          <Button children="Log in" type="submit" variant="primary" />
        </form>
      </div>
    </>
  );
}

export default Login;
