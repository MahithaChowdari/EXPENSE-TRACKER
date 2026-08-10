import { Link } from "react-router-dom";
import { FaArrowRight, FaWallet, FaChartPie, FaArrowUp, FaArrowDown } from "react-icons/fa";

function Hero() {
  return (
    <section className="min-h-[calc(100vh-76px)] bg-slate-50 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

        {/* LEFT SIDE */}
        <div className="z-10">

          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
            #1 Expense Tracker for Students
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-slate-900">
            Manage Your Money
            <br />
            <span className="text-blue-600">
              Smarter Than Ever
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
            Track your income, expenses, budgets and savings with a
            beautiful dashboard designed especially for students.
            Manage your finances effortlessly and achieve your goals.
          </p>

          {/* GET STARTED */}
          <div className="mt-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <FaArrowRight />
            </Link>
          </div>

        </div>

        {/* RIGHT SIDE - EXPENSE TRACKER VISUAL */}
        <div className="relative flex justify-center items-center">

          {/* Background decoration */}
          <div className="absolute w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>

          {/* Dashboard Card */}
          <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">

            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <p className="text-sm text-gray-500">
                  Total Balance
                </p>

                <h2 className="text-3xl font-bold text-slate-900">
                  $12,450
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FaWallet className="text-blue-600 text-2xl" />
              </div>

            </div>

            {/* Income / Expense Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="bg-green-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FaArrowUp />
                  <span className="text-sm font-medium">
                    Income
                  </span>
                </div>

                <p className="text-xl font-bold text-slate-800">
                  $8,250
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <FaArrowDown />
                  <span className="text-sm font-medium">
                    Expenses
                  </span>
                </div>

                <p className="text-xl font-bold text-slate-800">
                  $3,780
                </p>
              </div>

            </div>

            {/* Chart Section */}
            <div className="bg-slate-50 rounded-2xl p-5">

              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Monthly Spending
                  </h3>

                  <p className="text-xs text-gray-500">
                    Expense overview
                  </p>
                </div>

                <FaChartPie className="text-blue-600 text-xl" />
              </div>

              {/* Fake Bar Chart */}
              <div className="h-40 flex items-end justify-between gap-3 px-2">

                <div className="w-full bg-blue-200 rounded-t-lg h-[45%]"></div>

                <div className="w-full bg-blue-300 rounded-t-lg h-[65%]"></div>

                <div className="w-full bg-blue-400 rounded-t-lg h-[52%]"></div>

                <div className="w-full bg-blue-500 rounded-t-lg h-[80%]"></div>

                <div className="w-full bg-blue-400 rounded-t-lg h-[60%]"></div>

                <div className="w-full bg-blue-600 rounded-t-lg h-[90%]"></div>

                <div className="w-full bg-blue-300 rounded-t-lg h-[70%]"></div>

              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-3">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>

            </div>

            {/* Recent Transactions */}
            <div className="mt-6">

              <h3 className="font-bold text-slate-800 mb-3">
                Recent Transactions
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Food & Dining
                </span>
                <span className="text-sm font-semibold text-red-500">
                  -$42
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Scholarship
                </span>
                <span className="text-sm font-semibold text-green-500">
                  +$500
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  Transportation
                </span>
                <span className="text-sm font-semibold text-red-500">
                  -$25
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;