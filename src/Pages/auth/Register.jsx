import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import ActionButton from "../../ui/ActionButton";
import { Link, useNavigate } from "react-router";
import AuthShell from "../../components/AuthShell";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  const submitRegister = async (data) => {
    setLoading(true);
    setRequestError("");
    setRequestSuccess("");

    if (!data.username || !data.email || !data.password) {
      setRequestError("Please complete all required fields.");
      setLoading(false);
      return;
    }

    setRequestSuccess(
      "Registration shell completed. You can continue to the login screen and enter the private admin dashboard locally.",
    );
    setLoading(false);
    window.setTimeout(() => {
      navigate("/auth/login");
    }, 900);
  };

  return (
    <AuthShell
      title="Create the admin account"
      description="This registration view mirrors the future backend contract but currently works as a polished frontend shell. It lets us validate structure, field design, and the protected-flow handoff before wiring `/api/auth/register`."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-accent-primary">
            Go to login
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(submitRegister)}>
        <div className="space-y-3">
          <h2 className="text-3xl">Register</h2>
          <p className="text-sm leading-7 text-secondary">
            The form already follows the intended field set and can be wired directly to
            backend validation later.
          </p>
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter your username"
            classes="rounded-xl border-slate-300 px-4 py-3"
            validation={{
              ...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "A username must be at least 3 characters long",
                },
                pattern: {
                  value: /^[a-zA-Z0-9-._]+$/,
                  message:
                    "Usernames can only contain letters, numbers, dashes, dots, and underscores",
                },
                maxLength: {
                  value: 16,
                  message: "A username cannot be longer than 16 characters",
                },
              }),
            }}
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-700">{errors.username.message}</p>
          )}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            classes="rounded-xl border-slate-300 px-4 py-3"
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
            <p className="mt-2 text-sm text-red-700">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Enter your password"
            classes="rounded-xl border-slate-300 px-4 py-3"
            validation={{
              ...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 8,
                  message: "Passwords must be atleast 8 characters long",
                },
                maxLength: {
                  value: 64,
                  message: "Passwords can not be longer than 64 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/,
                  message:
                    "Password must contain a lower case, upper case, number, and special character",
                },
              }),
            }}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-700">{errors.password.message}</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-secondary">
          After backend integration, this page can map directly to the documented
          guest-only register route and surface server validation messages in the same layout.
        </div>

        {requestError && (
          <p className="text-sm text-red-700">{requestError}</p>
        )}

        {requestSuccess && (
          <p className="text-sm text-emerald-700">{requestSuccess}</p>
        )}

        <p className="text-sm text-secondary">
          By signing up, you agree to the privacy policy and terms and conditions.
        </p>

        <ActionButton
          type="submit"
          classes={loading ? "!cursor-wait !bg-blue-500 !text-gray-100" : ""}
        >
          {loading ? "Preparing Login..." : "Register Now"}
        </ActionButton>
      </form>
    </AuthShell>
  );
}

export default Register;
