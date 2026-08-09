import {
  FaWallet,
  FaChartPie,
  FaMoneyBillWave,
  FaPiggyBank,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const menu = [
  {
    title: "Dashboard",
    icon: <FaWallet />,
    path: "/dashboard",
  },
  {
    title: "Income",
    icon: <FaMoneyBillWave />,
    path: "/income",
  },
  {
    title: "Expenses",
    icon: <FaMoneyBillWave />,
    path: "/expenses",
  },
  {
    title: "Budgets",
    icon: <FaPiggyBank />,
    path: "/budgets",
  },
  {
    title: "Analytics",
    icon: <FaChartPie />,
    path: "/analytics",
  },
  {
    title: "Settings",
    icon: <FaCog />,
    path: "/settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col shadow-2xl">

      {/* Brand */}
      <div className="px-7 py-7 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <FaWallet className="text-xl" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Expense Tracker
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Smart Student Finance
            </p>
          </div>

        </div>

      </div>

      {/* Navigation title */}
      <div className="px-7 pt-7 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">

        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-4 py-3.5 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.title}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom Card */}
      <div className="mx-4 mb-5 p-4 rounded-2xl bg-white/5 border border-white/10">

        <p className="text-xs text-slate-400">
          Manage your finances
        </p>

        <p className="text-sm font-semibold mt-1">
          Track. Save. Grow. 🚀
        </p>

      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="mx-4 mb-6 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
      >
        <FaSignOutAlt />
        <span className="font-medium">
          Logout
        </span>
      </button>

    </aside>
  );
}

export default Sidebar;