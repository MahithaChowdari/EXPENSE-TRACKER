import { FaWallet } from "react-icons/fa";

function Logo() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
        <FaWallet className="text-white text-2xl" />
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Expense Tracker
        </h1>

        <p className="text-gray-500">
          Smart Student Finance
        </p>
      </div>
    </div>
  );
}

export default Logo;