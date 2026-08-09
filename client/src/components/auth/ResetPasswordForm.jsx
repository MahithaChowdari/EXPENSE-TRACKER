import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";
import api from "../../services/api";

function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await api.post(
        `/auth/reset-password/${token}`,
        {
          password: data.password,
        }
      );

      toast.success(
        "Password reset successful! 🎉"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    }
  };

  return (
    <AuthLayout>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <PasswordInput
          label="New Password"
          name="password"
          placeholder="Enter new password"
          register={register}
          rules={{
            required:
              "New password is required",
            minLength: {
              value: 6,
              message:
                "Password must be at least 6 characters",
            },
          }}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm new password"
          register={register}
          rules={{
            required:
              "Please confirm your password",
            validate: (value) =>
              value === password ||
              "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
        >
          {isSubmitting
            ? "Resetting Password..."
            : "Reset Password"}
        </button>

      </form>

      <p className="text-center mt-6">

        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Back to Login
        </Link>

      </p>

    </AuthLayout>
  );
}

export default ResetPasswordForm;