function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition duration-300 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;