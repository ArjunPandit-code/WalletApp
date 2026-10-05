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

    const exists = budgetData.some((b) => b.category === category);

    const arr = exists
      ? budgetData.map((b) =>
          b.category === category ? { ...b, amount: Number(amount) } : b,
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
    saveBudgets(budgetData.filter((b) => b.category !== cat));
  }

  function spentIn(cat) {
    return expenseData
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }

  function barColor(percent) {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-yellow-500";

    return "bg-green-500";
  }

  const totalBudget = salaryData.reduce((sum, s) => sum + Number(s.amount), 0);

  const totalSpent = expenseData.reduce((sum, e) => sum + Number(e.amount), 0);

  const remaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-[#0b0b0a] px-4 pb-10 pt-32 text-gray-100 sm:px-6 lg:ml-60 lg:px-8 lg:pt-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#252321] pb-6">
        <p className="mb-2 font-mono text-[10px] font-bold tracking-[0.2em] text-[#ff7424]">
          / BUDGET / CONTROL SYSTEM
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Budget Control
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Set spending limits and monitor your financial usage.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-[#713817] bg-[#1b100a] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ff7424] shadow-[0_0_10px_#ff7424]" />

            <span className="font-mono text-[10px] font-bold tracking-wider text-[#ff7424]">
              BUDGET ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total Budget */}
        <div className="rounded-xl border border-[#252321] bg-[#111110] p-5">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-gray-600">
            TOTAL BUDGET
          </p>

          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            ₹{totalBudget.toLocaleString("en-IN")}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            Available financial allocation
          </p>
        </div>

        {/* Spent */}
        <div className="rounded-xl border border-[#252321] bg-[#111110] p-5">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-gray-600">
            AMOUNT SPENT
          </p>

          <h2 className="mt-3 text-2xl font-black text-[#ff7424] sm:text-3xl">
            ₹{totalSpent.toLocaleString("en-IN")}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            Current expense consumption
          </p>
        </div>

        {/* Remaining */}
        <div className="rounded-xl border border-[#252321] bg-[#111110] p-5">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-gray-600">
            REMAINING
          </p>

          <h2
            className={`mt-3 text-2xl font-black sm:text-3xl ${
              remaining < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {remaining < 0 ? "-" : ""}₹
            {Math.abs(remaining).toLocaleString("en-IN")}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            {remaining < 0 ? "Budget exceeded" : "Available remaining amount"}
          </p>
        </div>
      </div>

      {/* Set Budget */}
      <div className="mt-5 rounded-xl border border-[#252321] bg-[#111110] p-5 sm:p-6">
        <div className="mb-6">
          <p className="font-mono text-[9px] tracking-[0.16em] text-[#ff7424]">
            CONFIGURATION
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">Set Budget</h2>

          <p className="mt-1 text-xs text-gray-600">
            Choose a category and define its spending limit.
          </p>
        </div>

        <form onSubmit={handleSetBudget}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Category */}
            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-gray-500">
                CATEGORY
              </label>

              <select
                className="w-full rounded-lg border border-[#292726] bg-[#0b0b0a] px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-[#ff7424] focus:ring-1 focus:ring-[#713817]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>

                <option value="food">Food</option>
                <option value="shopping">Shopping</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="education">Education</option>
                <option value="bills">Bills</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-gray-500">
                BUDGET AMOUNT
              </label>

              <input
                type="number"
                placeholder="Enter budget amount"
                className="w-full rounded-lg border border-[#292726] bg-[#0b0b0a] px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 outline-none transition focus:border-[#ff7424] focus:ring-1 focus:ring-[#713817]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 rounded-lg bg-[#ff7424] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff853d] active:scale-[0.98]"
          >
            + Set Budget
          </button>
        </form>
      </div>

      {/* Current Budgets */}
      <div className="mt-5 rounded-xl border border-[#252321] bg-[#111110] p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.16em] text-[#ff7424]">
              MONITORING
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Current Budgets
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Track spending against each category limit.
            </p>
          </div>

          <span className="w-fit rounded-md border border-[#713817] bg-[#1b100a] px-3 py-1.5 font-mono text-[9px] font-bold tracking-wider text-[#ff7424]">
            {budgetData.length} BUDGETS
          </span>
        </div>

        {/* Empty */}
        {budgetData.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#292726] bg-[#0b0b0a] px-4 py-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#292726] text-[#ff7424]">
              $
            </div>

            <p className="mt-4 text-sm font-medium text-gray-400">
              No budgets set yet
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Set your first budget using the configuration above.
            </p>
          </div>
        )}

        {/* Budget List */}
        <div className="space-y-3">
          {budgetData.map((b) => {
            const spent = spentIn(b.category);

            const percent = b.amount > 0 ? (spent / b.amount) * 100 : 0;

            const left = b.amount - spent;

            return (
              <div
                key={b.category}
                className="rounded-lg border border-[#252321] bg-[#0b0b0a] p-4 transition hover:border-[#3a3029]"
              >
                {/* Top */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          percent >= 100
                            ? "bg-red-500"
                            : percent >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />

                      <h3 className="text-sm font-bold capitalize text-gray-200">
                        {b.category}
                      </h3>
                    </div>

                    <p className="mt-2 font-mono text-[10px] text-gray-600">
                      ₹{spent.toLocaleString("en-IN")} spent
                      {" / "}₹{b.amount.toLocaleString("en-IN")} limit
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(b.category)}
                    className="rounded-md border border-transparent px-3 py-2 font-mono text-[9px] font-bold tracking-wider text-red-500 transition hover:border-red-900/50 hover:bg-red-950/20"
                  >
                    DELETE
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="mb-2 flex justify-between font-mono text-[9px] text-gray-600">
                    <span>USAGE</span>

                    <span>{Math.round(percent)}%</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-sm bg-[#252321]">
                    <div
                      className={`h-full transition-all ${barColor(percent)}`}
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-600">
                    {percent >= 100
                      ? "LIMIT REACHED"
                      : percent >= 80
                        ? "APPROACHING LIMIT"
                        : "WITHIN LIMIT"}
                  </span>

                  <span
                    className={`font-mono text-[10px] font-bold ${
                      left < 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {left < 0
                      ? `₹${Math.abs(left).toLocaleString("en-IN")} OVER`
                      : `₹${left.toLocaleString("en-IN")} LEFT`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col gap-2 border-t border-[#252321] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[9px] tracking-[0.12em] text-gray-700">
          MYWALLET / BUDGET CONTROL SYSTEM
        </p>

        <p className="font-mono text-[9px] text-gray-700">
          {budgetData.length} ACTIVE LIMITS
        </p>
      </div>
    </div>
  );
}

export default Budget;
