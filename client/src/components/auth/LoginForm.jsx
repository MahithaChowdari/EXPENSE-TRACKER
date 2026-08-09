import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import api from "../../services/api";

function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      // ==========================================
      // SAVE JWT TOKEN
      // ==========================================

      localStorage.setItem(
        "token",
        response.data.token
      );

      // ==========================================
      // SAVE USER INFORMATION
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login successful!");

      // ==========================================
      // GO TO DASHBOARD
      // ==========================================

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* ====================================== */}
        {/* EMAIL */}
        {/* ====================================== */}

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          rules={{
            required: "Email is required",

            pattern: {
              value:
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:
                "Please enter a valid email address",
            },
          }}
          error={errors.email}
        />

        {/* ====================================== */}
        {/* PASSWORD */}
        {/* ====================================== */}

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          register={register}
          rules={{
            required: "Password is required",
          }}
          error={errors.password}
        />

        {/* ====================================== */}
        {/* REMEMBER / FORGOT */}
        {/* ====================================== */}

        <div className="flex justify-between items-center">

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-4 h-4"
            />

            Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        {/* ====================================== */}
        {/* LOGIN BUTTON */}
        {/* ====================================== */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
        >
          {isSubmitting
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      {/* ====================================== */}
      {/* REGISTER */}
      {/* ====================================== */}

      <p className="text-center mt-6 text-gray-600">

        Don't have an account?

        <Link
          to="/register"
          className="ml-2 text-blue-600 font-semibold hover:underline"
        >
          Register
        </Link>

      </p>
    </AuthLayout>
  );
}

export default LoginForm;