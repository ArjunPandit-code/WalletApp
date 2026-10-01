import { useEffect, useState } from "react";

function Budget() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const [budgetData, setBudgetData] = useState(() => {
    const stored = localStorage.getItem("budgetData");
    return stored ? JSON.parse(stored) : [];
  });

  const [salaryData, setSalaryData] = useState(() => {
    const stored = localStorage.getItem("salaryData");
    return stored ? JSON.parse(stored) : [];
  });

  const [expenseData, setExpenseData] = useState(() => {
    const stored = localStorage.getItem("expenseData");
    return stored ? JSON.parse(stored) : [];
  });

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

  function saveBudgets(arr) {
    setBudgetData(arr);
    localStorage.setItem("budgetData", JSON.stringify(arr));
  }

  function handleSetBudget(e) {
    e.preventDefault();

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Enter a budget amount greater than 0.");
      return;
    }

    setError("");

    const exists = budgetData.some(
      (b) => b.category === category
    );

    const arr = exists
      ? budgetData.map((b) =>
          b.category === category
            ? { ...b, amount: Number(amount) }
            : b
        )
      : [
          ...budgetData,
          {
            category,
            amount: Number(amount),
          },
        ];

    saveBudgets(arr);

    setCategory("");
    setAmount("");
  }

  function handleDelete(cat) {
    saveBudgets(
      budgetData.filter((b) => b.category !== cat)
    );
  }

  function spentIn(cat) {
    return expenseData
      .filter((e) => e.category === cat)
      .reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
  }

  function barColor(percent) {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-yellow-500";

    return "bg-green-500";
  }

  const totalBudget = salaryData.reduce(
    (sum, s) => sum + Number(s.amount),
    0
  );

  const totalSpent = expenseData.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const remaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gray-950 p-4 pt-32 sm:p-6 sm:pt-32 lg:ml-60 lg:p-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Budget
        </h1>

        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Set and manage your spending limits
        </p>

      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">

        {/* Total Budget */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

          <p className="text-sm font-medium text-gray-400">
            Total Budget
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            ₹{totalBudget}
          </h2>

        </div>

        {/* Spent */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

          <p className="text-sm font-medium text-gray-400">
            Amount Spent
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400 sm:text-4xl">
            ₹{totalSpent}
          </h2>

        </div>

        {/* Remaining */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

          <p className="text-sm font-medium text-gray-400">
            Remaining
          </p>

          <h2
            className={`mt-2 text-3xl font-bold sm:text-4xl ${
              remaining < 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {remaining < 0 ? "-" : ""}₹
            {Math.abs(remaining)}
          </h2>

        </div>

      </div>

      {/* Set Budget */}
      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mt-8 sm:p-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-white">
            Set Budget
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Choose a category and set its monthly limit
          </p>

        </div>

        <form onSubmit={handleSetBudget}>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Category */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Category
              </label>

              <select
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option value="">Select category</option>
                <option value="food">Food</option>
                <option value="shopping">Shopping</option>
                <option value="transport">Transport</option>
                <option value="entertainment">
                  Entertainment
                </option>
                <option value="education">
                  Education
                </option>
                <option value="bills">Bills</option>
                <option value="other">Other</option>

              </select>

            </div>

            {/* Amount */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Budget Amount
              </label>

              <input
                type="number"
                placeholder="Enter budget"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />

            </div>

          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-500 active:scale-[0.98] sm:w-auto"
          >
            Set Budget
          </button>

        </form>

      </div>

      {/* Current Budgets */}
      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mt-8 sm:p-6">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Current Budgets
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Spending against each limit
            </p>

          </div>

          <span className="w-fit rounded-full bg-green-950 px-3 py-1 text-sm font-medium text-green-400">
            {budgetData.length} Budgets
          </span>

        </div>

        {/* Empty */}
        {budgetData.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 px-4 py-10 text-center">

            <p className="font-medium text-gray-400">
              No budgets set yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Set your first budget using the form above.
            </p>

          </div>
        )}

        {/* Budget List */}
        <div className="space-y-3">

          {budgetData.map((b) => {

            const spent = spentIn(b.category);

            const percent =
              b.amount > 0
                ? (spent / b.amount) * 100
                : 0;

            const left = b.amount - spent;

            return (
              <div
                key={b.category}
                className="rounded-xl border border-gray-800 bg-gray-800 p-4 transition hover:bg-gray-700"
              >

                {/* Top */}
                <div className="flex items-center justify-between gap-4">

                  <div className="min-w-0">

                    <h3 className="text-base font-semibold capitalize text-gray-100">
                      {b.category}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      ₹{spent} spent of ₹{b.amount}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(b.category)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950 hover:text-red-300"
                  >
                    Delete
                  </button>

                </div>

                {/* Progress */}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-700">

                  <div
                    className={`h-full rounded-full transition-all ${barColor(
                      percent
                    )}`}
                    style={{
                      width: `${Math.min(
                        percent,
                        100
                      )}%`,
                    }}
                  />

                </div>

                {/* Bottom */}
                <div className="mt-2 flex items-center justify-between text-sm">

                  <span className="text-gray-400">
                    {Math.round(percent)}% used
                  </span>

                  <span
                    className={`font-medium ${
                      left < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {left < 0
                      ? `₹${Math.abs(
                          left
                        )} over budget`
                      : `₹${left} left`}
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

export default Budget;