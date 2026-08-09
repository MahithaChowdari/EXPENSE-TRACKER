import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import AuthLayout from "./AuthLayout";
import api from "../../services/api";
function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
  try {
    const response = await api.post("/auth/register", {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
    });

    alert(response.data.message);

  } catch (error) {
    alert(error.response?.data?.message || "Registration Failed");
  }
};

  return (
    <AuthLayout
        title="Create Account"
        subtitle="Join Expense Tracker today"
        >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Expense Tracker
        </h1>

        <p className="text-gray-500 mt-2">
          Create your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <InputField
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          register={register}
          rules={{
            required: "Full Name is required",
          }}
          error={errors.fullName}
        />

        <InputField
          label="Username"
          name="username"
          placeholder="Choose a username"
          register={register}
          rules={{
            required: "Username is required",
            minLength: {
              value: 4,
              message: "Minimum 4 characters",
            },
          }}
          error={errors.username}
        />

        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          register={register}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: "Invalid email address",
            },
          }}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Create a strong password"
          register={register}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
              message:
                "Must contain uppercase, lowercase, number and special character",
            },
          }}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          register={register}
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300"
        >
          Create Account
        </button>

      </form>

      <div className="text-center mt-8">
        <p className="text-gray-500">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterForm;