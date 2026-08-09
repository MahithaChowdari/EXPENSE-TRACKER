function BalanceCard({ balance = 0 }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-7 shadow-lg">

      <p className="text-blue-100 text-sm font-medium">
        Total Balance
      </p>

      <h2 className="text-4xl font-bold mt-2">
        ₹{Number(balance).toLocaleString("en-IN")}
      </h2>

      <p className="text-blue-100 mt-3">
        Your current available balance
      </p>

    </div>
  );
}

export default BalanceCard;