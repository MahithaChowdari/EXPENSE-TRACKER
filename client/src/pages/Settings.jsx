import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCog,
  FaMoon,
  FaSun,
  FaBell,
  FaMoneyBillWave,
  FaLock,
  FaSignOutAlt,
  FaSave,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

function Settings() {
  const navigate = useNavigate();

  // Theme
  const {
    darkMode,
    toggleDarkMode,
  } = useTheme();

  // Settings
  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");

  // Load saved settings
  useEffect(() => {
    const savedCurrency =
      localStorage.getItem("currency");

    const savedNotifications =
      localStorage.getItem("notifications");

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    if (savedNotifications !== null) {
      setNotifications(
        savedNotifications === "true"
      );
    }
  }, []);

  // Save settings
  const handleSave = () => {
    localStorage.setItem(
      "currency",
      currency
    );

    localStorage.setItem(
      "notifications",
      String(notifications)
    );

    setMessage(
      "Settings saved successfully! ✅"
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Logout
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login", {
    replace: true,
  });
};

  return (
    <div
      className={`min-h-screen p-6 md:p-8 transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-800"
      }`}
    >

      {/* ================= HEADER ================= */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
            <FaCog className="text-xl" />
          </div>

          <div>

            <h1
              className={`text-3xl md:text-4xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-slate-800"
              }`}
            >
              Settings
            </h1>

            <p
              className={`mt-1 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Manage your Expense Tracker preferences.
            </p>

          </div>

        </div>

      </div>

      {/* ================= SUCCESS MESSAGE ================= */}

      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <div className="max-w-4xl space-y-6">

        {/* ================= APPEARANCE ================= */}

        <div
          className={`rounded-2xl border shadow-sm p-6 transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              {darkMode ? (
                <FaMoon />
              ) : (
                <FaSun />
              )}
            </div>

            <div>

              <h2
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                Appearance
              </h2>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Customize how your application looks.
              </p>

            </div>

          </div>

          <div className="mt-6 flex items-center justify-between">

            <div>

              <p
                className={`font-semibold ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                Dark Mode
              </p>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-400"
                }`}
              >
                Switch between light and dark appearance.
              </p>

            </div>

            {/* DARK MODE SWITCH */}

            <button
              type="button"
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition ${
                darkMode
                  ? "bg-blue-600"
                  : "bg-slate-300"
              }`}
            >

              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
                  darkMode
                    ? "left-8"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </div>

        {/* ================= CURRENCY ================= */}

        <div
          className={`rounded-2xl border shadow-sm p-6 transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <FaMoneyBillWave />
            </div>

            <div>

              <h2
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                Currency
              </h2>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Select the currency used by your tracker.
              </p>

            </div>

          </div>

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
            className={`mt-6 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-slate-300 text-slate-700"
            }`}
          >

            <option value="INR">
              ₹ Indian Rupee (INR)
            </option>

            <option value="USD">
              $ US Dollar (USD)
            </option>

            <option value="EUR">
              € Euro (EUR)
            </option>

            <option value="GBP">
              £ British Pound (GBP)
            </option>

          </select>

        </div>

        {/* ================= NOTIFICATIONS ================= */}

        <div
          className={`rounded-2xl border shadow-sm p-6 transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <FaBell />
            </div>

            <div>

              <h2
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                Notifications
              </h2>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Manage spending and budget notifications.
              </p>

            </div>

          </div>

          <div className="mt-6 flex items-center justify-between">

            <div>

              <p
                className={`font-semibold ${
                  darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                Enable Notifications
              </p>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-400"
                }`}
              >
                Receive budget and spending alerts.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              className={`relative w-14 h-7 rounded-full transition ${
                notifications
                  ? "bg-green-500"
                  : "bg-slate-300"
              }`}
            >

              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
                  notifications
                    ? "left-8"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </div>

        {/* ================= ACCOUNT ================= */}

        <div
          className={`rounded-2xl border shadow-sm p-6 transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >

          <div className="flex items-center gap-3 mb-2">

            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <FaLock />
            </div>

            <div>

              <h2
                className={`text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                Account
              </h2>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Manage your account and security.
              </p>

            </div>

          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/forgot-password"
                )
              }
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-medium transition ${
                darkMode
                  ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FaLock />
              Change Password
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        </div>

        {/* ================= SAVE ================= */}

        <button
          type="button"
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-200 transition"
        >
          <FaSave />
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;