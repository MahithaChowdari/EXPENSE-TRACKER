function SummaryCards({
  income = 0,
  expenses = 0,
  savings = 0,
}) {
  const cards = [
    {
      title: "Total Income",
      amount: income,
      icon: "💰",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      icon: "💸",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Savings",
      amount: savings,
      icon: "💎",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm font-medium">
                {card.title}
              </p>

              <h3 className={`text-2xl font-bold mt-2 ${card.text}`}>
                ₹{Number(card.amount).toLocaleString("en-IN")}
              </h3>
            </div>

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.bg}`}
            >
              {card.icon}
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}

export default SummaryCards;