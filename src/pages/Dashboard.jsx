import { useEffect, useState } from "react";

function Dashboard(props) {
  const [salaryData, setSalaryData] = useState(() => {
    const stored = localStorage.getItem("salaryData");
    return stored ? JSON.parse(stored) : [];
  });

  const [expenseData, setExpenseData] = useState(() => {
    const stored = localStorage.getItem("expenseData");
    return stored ? JSON.parse(stored) : [];
  });

  // LocalStorage se latest data sync karna
  useEffect(() => {
    function syncData() {
      const salary = localStorage.getItem("salaryData");
      const expense = localStorage.getItem("expenseData");

      setSalaryData(salary ? JSON.parse(salary) : []);
      setExpenseData(expense ? JSON.parse(expense) : []);
    }

    window.addEventListener("storage", syncData);
    window.addEventListener("focus", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("focus", syncData);
    };
  }, []);

  // Income + Expense ko ek array me combine karna
  const allTransactions = [
    ...salaryData.map((item, index) => ({
      ...item,
      type: "income",
      index,
    })),

    ...expenseData.map((item, index) => ({
      ...item,
      type: "expense",
      index,
    })),
  ].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;

    const dateB = b.date ? new Date(b.date).getTime() : 0;

    return dateB - dateA;
  });

  // Sirf latest 5 transactions
  const recentTransactions = allTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 px-4 pb-8 pt-32 sm:px-6 lg:ml-60 lg:px-8 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Here's your wallet overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {/* Balance */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
          <p className="text-sm text-gray-400">Total Balance</p>

          <h2
            className={`mt-2 text-2xl font-bold sm:text-3xl ${
              props.income - props.expense > 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            ₹{props.income - props.expense}
          </h2>
        </div>

        {/* Income */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
          <p className="text-sm text-gray-400">Total Income</p>

          <h2 className="mt-2 text-2xl font-bold text-green-400 sm:text-3xl">
            ₹{props.income}
          </h2>
        </div>

        {/* Expenses */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
          <p className="text-sm text-gray-400">Total Expenses</p>

          <h2 className="mt-2 text-2xl font-bold text-red-400 sm:text-3xl">
            ₹{props.expense}
          </h2>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mt-8 sm:p-6">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your latest transactions
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-950 px-3 py-1 text-sm font-medium text-green-400">
            {recentTransactions.length} Records
          </span>
        </div>

        {/* No Transactions */}
        {recentTransactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 px-4 py-10 text-center">
            <p className="font-medium text-gray-400">No transactions yet</p>

            <p className="mt-1 text-sm text-gray-500">
              Add income or expenses and they will show up here.
            </p>
          </div>
        )}

        {/* Transactions */}
        <div className="space-y-3">
          {recentTransactions.map((t) => {
            const isIncome = t.type === "income";

            return (
              <div
                key={`${t.type}-${t.index}`}
                className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-800 p-4 transition hover:bg-gray-700 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Information */}
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-100">
                    {t.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {/* Type */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        isIncome
                          ? "bg-green-950 text-green-400"
                          : "bg-red-950 text-red-400"
                      }`}
                    >
                      {t.type}
                    </span>

                    {/* Category */}
                    <span className="rounded-full bg-gray-700 px-2.5 py-1 text-xs font-medium capitalize text-gray-300">
                      {t.category}
                    </span>

                    {/* Date */}
                    <span className="text-sm text-gray-400">{t.date}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center sm:justify-end">
                  <span
                    className={`text-lg font-bold ${
                      isIncome ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{t.amount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
