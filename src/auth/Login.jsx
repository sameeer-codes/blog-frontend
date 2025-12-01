import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useApi from "../utils/useApi";
import { useForm } from "react-hook-form";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // Create API instance
  const api = useApi();

  async function handleLogin(data) {
    const loginData = data;
    console.log(data);
    return data;

    const response = api.post("/auth/login", loginData);

    if (response.status === "success") {
      const { data } = response;
      setToken(data.jwt);
    } else {
      console.log(response);
    }

    setEmail("");
    setPassword("");
  }

  return (
    <>
      <div className="h-screen w-full grid place-items-center  bg-gray-200 p-4">
        <form
          className="flex flex-col w-full max-w-100 p-8  bg-white rounded-md gap-4 shadow-md"
          onSubmit={handleSubmit(handleLogin)}
        >
          <h2 className="text-center text-4xl font-medium mb-4 pb-4 border-b-2 border-b-blue-700">
            Login
          </h2>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Please enter a valid email",
              },
            })}
            placeholder="Enter your Email"
            className="w-full border p-2 px-3 rounded-sm border-gray-300"
          />
          {errors.email && (
            <p className="text-red-700 text-sm">{errors.email.message}</p>
          )}
          <input
            type="password"
            {...register("password", {
              required: "Please enter your password",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                message:
                  "Password must contain at least one lower case, upper case and one special character and number",
              },
            })}
            placeholder="Enter your Password"
            className="w-full border p-2 px-3 rounded-sm border-gray-300"
          />
          {errors.password && (
            <p className="text-red-700 text-sm">{errors.password.message}</p>
          )}
          <div>
            <button className="text-blue-700 hover:text-blue-900 transition-all cursor-pointer">
              Forgot Password?
            </button>
          </div>
          <button
            type="Submit"
            className="p-2 bg-blue-700 rounded-md text-white cursor-pointer hover:bg-blue-900 transition-all font-medium uppercase"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
