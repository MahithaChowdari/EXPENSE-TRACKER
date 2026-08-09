import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import api from "../../services/api";

function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email: data.email,
        }
      );

      toast.success(
        response.data?.message ||
          "If an account exists, a reset link has been sent."
      );
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to send reset email."
      );
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your registered email"
          register={register}
          rules={{
            required: "Email is required",
          }}
          error={errors.email}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
        >
          {isSubmitting
            ? "Sending..."
            : "Send Reset Link"}
        </button>

      </form>

      <p className="text-center mt-6 text-gray-600">
        Remember your password?

        <Link
          to="/login"
          className="ml-2 text-blue-600 font-semibold hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPasswordForm;