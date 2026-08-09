import {
  FaWallet,
  FaChartPie,
  FaFileExport,
  FaBullseye,
  FaCalendarAlt,
  FaLock,
} from "react-icons/fa";

function FeatureCard() {
  const features = [
    {
      icon: <FaWallet className="text-3xl text-white" />,
      bg: "from-blue-600 to-cyan-500",
      title: "Expense Tracking",
      description:
        "Track every expense and income effortlessly with smart categorization.",
    },
    {
      icon: <FaChartPie className="text-3xl text-white" />,
      bg: "from-green-500 to-emerald-600",
      title: "Analytics Dashboard",
      description:
        "Understand your spending through interactive charts and reports.",
    },
    {
      icon: <FaBullseye className="text-3xl text-white" />,
      bg: "from-orange-500 to-red-500",
      title: "Budget Planning",
      description:
        "Set monthly budgets and receive alerts before overspending.",
    },
    {
      icon: <FaCalendarAlt className="text-3xl text-white" />,
      bg: "from-purple-500 to-pink-500",
      title: "Expense Calendar",
      description:
        "View all your daily, weekly and monthly transactions in one place.",
    },
    {
      icon: <FaFileExport className="text-3xl text-white" />,
      bg: "from-indigo-500 to-blue-600",
      title: "Export Reports",
      description:
        "Download reports instantly in PDF, Excel and CSV formats.",
    },
    {
      icon: <FaLock className="text-3xl text-white" />,
      bg: "from-slate-700 to-slate-900",
      title: "Secure Authentication",
      description:
        "Your account is protected with encrypted passwords and secure login.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-slate-900">
            Powerful Features
          </h2>

          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your finances, monitor spending,
            plan budgets and achieve your financial goals.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.bg} flex items-center justify-center shadow-lg`}
              >
                {feature.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default FeatureCard;