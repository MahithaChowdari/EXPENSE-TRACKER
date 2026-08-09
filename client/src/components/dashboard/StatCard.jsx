const colors = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  red: "bg-red-600",
  purple: "bg-purple-600",
};

function StatCard({ title, value, color = "blue" }) {
  return (
    <div
      className={`${colors[color]} text-white rounded-2xl p-6 shadow-lg`}
    >
      <h3 className="text-lg">
        {title}
      </h3>

      <h1 className="text-4xl font-bold mt-4">
        {value}
      </h1>
    </div>
  );
}

export default StatCard;