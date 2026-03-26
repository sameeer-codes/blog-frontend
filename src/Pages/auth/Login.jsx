import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import ActionButton from "../../ui/ActionButton";
import { AuthContext } from "../../stores/auth-context";
import Input from "../../ui/Input";
import { Link, useNavigate } from "react-router";
import AuthShell from "../../components/AuthShell";
import { getApiErrorMessage } from "../../lib/api-helpers";

function Login() {
  const {
    authActions: { login },
  } = useContext(AuthContext);

  const [requestError, setRequestError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  async function handleLogin(data) {
    setLoading(true);
    setRequestError("");

    if (!data.email || !data.password) {
      setRequestError("Please complete both fields before continuing.");
      setLoading(false);
      return;
    }

    try {
      await login({
        email: data.email.trim(),
        password: data.password,
      });

      reset();
      navigate("/posts/me");
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to log in with those credentials."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Log in to the admin workspace"
      description="Log in to open the private admin workspace and manage posts and uploads."
      footer={
        <>
          Need an account?{" "}
          <Link to="/auth/register" className="font-semibold text-accent-primary">
            Create one here
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleLogin)}>
        <div className="space-y-3">
          <h2 className="text-3xl">Log in</h2>
          <p className="text-sm leading-7 text-secondary">
            Enter your account details to continue into the private dashboard.
          </p>
        </div>
        <div>
          <Input
            type="email"
            validation={{
              ...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Please enter a valid email",
                },
              }),
            }}
            placeholder="Enter your email"
            classes="rounded-xl border-slate-300 px-4 py-3"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-700">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            validation={{
              ...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 8,
                  message: "Password should be at least 8 characters long",
                },
              }),
            }}
            placeholder="Enter your password"
            classes="rounded-xl border-slate-300 px-4 py-3"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-700">{errors.password.message}</p>
          )}
        </div>

        {requestError && (
          <p className="text-sm text-red-700">{requestError}</p>
        )}

        <ActionButton
          type="submit"
          variant="primary"
          classes={loading ? "!cursor-wait !bg-blue-500 !text-gray-100" : ""}
        >
          {loading ? "Opening Workspace..." : "Log in"}
        </ActionButton>
      </form>
    </AuthShell>
  );
}

export default Login;
