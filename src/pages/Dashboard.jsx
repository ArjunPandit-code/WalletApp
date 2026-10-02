import React, { useEffect, useState } from "react";

function Dashboard({ income, expense }) {
  const [transactions, setTransactions] = useState([]);

  function loadTransactions() {
    const salaryData =
      JSON.parse(localStorage.getItem("salaryData")) || [];

    const expenseData =
      JSON.parse(localStorage.getItem("expenseData")) || [];

    const incomeTransactions = salaryData.map((item, index) => ({
      ...item,
      type: "income",
      index,
    }));

    const expenseTransactions = expenseData.map((item, index) => ({
      ...item,
      type: "expense",
      index,
    }));

    const allTransactions = [
      ...incomeTransactions,
      ...expenseTransactions,
    ];

    allTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setTransactions(allTransactions);
  }

  useEffect(() => {
    loadTransactions();

    window.addEventListener("storage", loadTransactions);
    window.addEventListener("focus", loadTransactions);

    return () => {
      window.removeEventListener("storage", loadTransactions);
      window.removeEventListener("focus", loadTransactions);
    };
  }, []);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 px-4 pb-8 pt-24 sm:px-6 sm:pt-24 lg:ml-60 lg:px-8 lg:pt-8">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-400">
          Here's your wallet overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Balance */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">
            Total Balance
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-400">
            ₹{Number(income) - Number(expense)}
          </h2>
        </div>

        {/* Income */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">
            Total Income
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-400">
            ₹{Number(income)}
          </h2>
        </div>

        {/* Expenses */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">
            Total Expenses
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-400">
            ₹{Number(expense)}
          </h2>
        </div>

      </div>

      {/* Recent Transactions */}
      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Recent Transactions
          </h2>

          <span className="text-sm text-gray-500">
            Latest 5
          </span>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="py-6 text-center text-gray-500">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-3">

            {recentTransactions.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-4"
              >

                <div className="min-w-0">
                  <h3 className="truncate font-medium text-white">
                    {item.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>
                      {item.category || "Other"}
                    </span>

                    <span>•</span>

                    <span>
                      {item.date}
                    </span>
                  </div>
                </div>

                <p
                  className={`ml-4 whitespace-nowrap font-semibold ${
                    item.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}₹
                  {Number(item.amount)}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;