import { useEffect, useState } from "react";

const CATEGORY_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#64748b",
];

function sumAmount(list) {
  return list.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );
}

function Charts() {
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

  const totalIncome = sumAmount(salaryData);
  const totalExpense = sumAmount(expenseData);

  const maxTotal = Math.max(
    totalIncome,
    totalExpense,
    1
  );

  /* Expense Categories */
  const categoryTotals = {};

  expenseData.forEach((e) => {
    const cat = e.category || "other";

    categoryTotals[cat] =
      (categoryTotals[cat] || 0) +
      Number(e.amount);
  });

  const categoryList = Object.entries(categoryTotals)
    .map(([category, value]) => ({
      category,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  let runningTotal = 0;

  const segments = categoryList.map((item, i) => {
    const percent =
      totalExpense > 0
        ? (item.value / totalExpense) * 100
        : 0;

    const segment = {
      ...item,
      percent,
      offset: runningTotal,
      color:
        CATEGORY_COLORS[
          i % CATEGORY_COLORS.length
        ],
    };

    runningTotal += percent;

    return segment;
  });

  /* Monthly Overview */
  const monthlyTotals = {};

  function addToMonth(list, field) {
    list.forEach((item) => {
      if (!item.date) return;

      const key = item.date.slice(0, 7);

      if (!monthlyTotals[key]) {
        monthlyTotals[key] = {
          income: 0,
          expense: 0,
        };
      }

      monthlyTotals[key][field] += Number(
        item.amount
      );
    });
  }

  addToMonth(salaryData, "income");
  addToMonth(expenseData, "expense");

  const months = Object.keys(monthlyTotals)
    .sort()
    .slice(-6)
    .map((key) => ({
      key,

      label: new Date(
        `${key}-01`
      ).toLocaleString("en-IN", {
        month: "short",
        year: "2-digit",
      }),

      income: monthlyTotals[key].income,
      expense: monthlyTotals[key].expense,
    }));

  const maxMonthly = Math.max(
    ...months.flatMap((m) => [
      m.income,
      m.expense,
    ]),
    1
  );

  return (
    <div className="min-h-screen bg-gray-950 px-4 pb-8 pt-24 sm:px-6 sm:pt-24 lg:ml-60 lg:px-8 lg:pt-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Charts
        </h1>

        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Analyze your income and expenses
        </p>

      </div>

      {/* First two charts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">

        {/* Income vs Expenses */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

          <h2 className="text-xl font-semibold text-white">
            Income vs Expenses
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Total across all records
          </p>

          {totalIncome === 0 &&
          totalExpense === 0 ? (
            <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-700 px-4 text-center text-sm text-gray-500">
              Add income or expenses to see this
              chart.
            </div>
          ) : (
            <div className="mt-6 flex h-64 items-end justify-center gap-10 rounded-xl bg-gray-800 px-6 pb-4 pt-6">

              {/* Income */}
              <div className="flex h-full w-24 flex-col items-center justify-end">

                <span className="mb-2 text-sm font-semibold text-green-400">
                  ₹{totalIncome}
                </span>

                <div
                  className="w-full rounded-t-lg bg-green-500 transition-all"
                  style={{
                    height: `${
                      (totalIncome /
                        maxTotal) *
                      80
                    }%`,
                  }}
                />

                <span className="mt-2 text-sm font-medium text-gray-400">
                  Income
                </span>

              </div>

              {/* Expense */}
              <div className="flex h-full w-24 flex-col items-center justify-end">

                <span className="mb-2 text-sm font-semibold text-red-400">
                  ₹{totalExpense}
                </span>

                <div
                  className="w-full rounded-t-lg bg-red-500 transition-all"
                  style={{
                    height: `${
                      (totalExpense /
                        maxTotal) *
                      80
                    }%`,
                  }}
                />

                <span className="mt-2 text-sm font-medium text-gray-400">
                  Expenses
                </span>

              </div>

            </div>
          )}

        </div>

        {/* Expense Categories */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

          <h2 className="text-xl font-semibold text-white">
            Expense Categories
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Where your money goes
          </p>

          {segments.length === 0 ? (
            <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-700 px-4 text-center text-sm text-gray-500">
              Add expenses to see the category
              split.
            </div>
          ) : (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center gap-6 rounded-xl bg-gray-800 p-4 sm:flex-row">

              {/* Donut */}
              <svg
                viewBox="0 0 36 36"
                className="h-40 w-40 shrink-0 -rotate-90"
                role="img"
                aria-label="Expense categories donut chart"
              >

                {/* Track */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="4"
                />

                {/* Segments */}
                {segments.map((s) => (
                  <circle
                    key={s.category}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="4"
                    strokeDasharray={`${s.percent} ${
                      100 - s.percent
                    }`}
                    strokeDashoffset={-s.offset}
                  />
                ))}

              </svg>

              {/* Legend */}
              <ul className="w-full space-y-2 sm:w-auto sm:min-w-44">

                {segments.map((s) => (
                  <li
                    key={s.category}
                    className="flex items-center justify-between gap-4 text-sm"
                  >

                    <span className="flex items-center gap-2 capitalize text-gray-300">

                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            s.color,
                        }}
                      />

                      {s.category}

                    </span>

                    <span className="font-medium text-gray-100">

                      ₹{s.value}{" "}

                      <span className="font-normal text-gray-500">
                        ({Math.round(s.percent)}%)
                      </span>

                    </span>

                  </li>
                ))}

              </ul>

            </div>
          )}

        </div>

      </div>

      {/* Monthly Overview */}
      <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mt-6 sm:p-6">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Monthly Overview
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Income and expenses for the last 6
              months
            </p>

          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-gray-400">

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-green-500" />
              Income
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-red-500" />
              Expenses
            </span>

          </div>

        </div>

        {months.length === 0 ? (
          <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-gray-700 px-4 text-center text-sm text-gray-500">
            Add records with a date to see the
            monthly overview.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl bg-gray-800 p-4">

            <div className="flex min-w-max items-end justify-around gap-8 px-2">

              {months.map((m) => (

                <div
                  key={m.key}
                  className="flex flex-col items-center"
                >

                  <div className="flex h-52 items-end gap-1.5">

                    {/* Income */}
                    <div
                      className="w-5 rounded-t-md bg-green-500 transition-all sm:w-7"
                      style={{
                        height: `${
                          (m.income /
                            maxMonthly) *
                          100
                        }%`,
                      }}
                      title={`Income: ₹${m.income}`}
                    />

                    {/* Expense */}
                    <div
                      className="w-5 rounded-t-md bg-red-500 transition-all sm:w-7"
                      style={{
                        height: `${
                          (m.expense /
                            maxMonthly) *
                          100
                        }%`,
                      }}
                      title={`Expenses: ₹${m.expense}`}
                    />

                  </div>

                  <span className="mt-2 text-sm font-medium text-gray-300">
                    {m.label}
                  </span>

                  <span
                    className={`text-xs font-medium ${
                      m.income - m.expense < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {m.income - m.expense < 0
                      ? "-"
                      : "+"}
                    ₹
                    {Math.abs(
                      m.income - m.expense
                    )}
                  </span>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Charts;