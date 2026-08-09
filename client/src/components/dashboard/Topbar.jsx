import {
  FaBell,
  FaPlus,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

function Topbar() {
  const location = useLocation();

  const pageNames = {
    "/dashboard": "Dashboard",
    "/income": "Income",
    "/expenses": "Expenses",
    "/budgets": "Budget Planner",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  const pageTitle =
    pageNames[location.pathname] || "Dashboard";

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {pageTitle}
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage your finances smarter 💰
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Add transaction */}
        <Link
          to="/add-transaction"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-200 transition-all"
        >
          <FaPlus className="text-sm" />
          Add Transaction
        </Link>

        {/* Notification */}
        <button
          type="button"
          className="relative w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
        >
          <FaBell className="text-gray-600" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            2
          </span>
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/100"
          alt="User"
          className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 shadow-sm"
        />

      </div>

    </header>
  );
}

export default Topbar;