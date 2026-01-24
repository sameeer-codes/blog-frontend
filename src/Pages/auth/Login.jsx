import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { AuthContext } from "../../stores/AuthContext";
import useApi from "../../hooks/useApi";
import Input from "../../ui/Input";
import { Link, useNavigate } from "react-router";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";

function Login() {
  const {
    token: [authToken, setAuthToken],
    loggedIn: [isLoggedIn, setIsLoggedIn],
  } = useContext(AuthContext);

  const [requestError, setRequestError] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const api = useApi();

  async function handleLogin(data) {
    setLoading(true);
    const loginData = data;
    setTimeout(async () => {
      try {
        const response = await api.post("/auth/login", loginData);
        const { data } = response;
        const token = data.data.jwt;
        reset();
        setAuthToken(token);
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        navigate("/");
        setLoading(false);
      } catch (error) {
        if (error.response.data.code === 401) {
          setRequestError("Please check your email or password, and try again");
        } else if (error.response.data.code === 403) {
          setRequestError("Already logged in.");
          navigate("/");
        } else {
          setRequestError("There was an error logging in, Please try again");
        }

        setLoading(false);
      } finally {
        setLoading(false);
      }
    }, 2000);
  }

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
          onSubmit={loading ? handleSubmit(null) : handleSubmit(handleLogin)}
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

          {requestError && (
            <p className="text-red-700 text-sm">{requestError}</p>
          )}
          <div>
            <Button children={"Forgot Password"} variant={"link"} />
          </div>
          <Button
            children="Log in"
            type="submit"
            variant="primary"
            classes={loading ? "!cursor-wait !bg-blue-500 !text-gray-100" : ""}
          />
        </form>
      </div>
    </>
  );
}

export default Login;
