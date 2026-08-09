function InputField({
  label,
  type = "text",
  placeholder,
  register,
  name,
  rules = {},
  error,
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none
        ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default InputField;