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
  return list.reduce((sum, item) => sum + Number(item.amount), 0);
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

  const maxTotal = Math.max(totalIncome, totalExpense, 1);

  /* Expense Categories */
  const categoryTotals = {};

  expenseData.forEach((e) => {
    const cat = e.category || "other";

    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
  });

  const categoryList = Object.entries(categoryTotals)
    .map(([category, value]) => ({
      category,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  let runningTotal = 0;

  const segments = categoryList.map((item, i) => {
    const percent = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;

    const segment = {
      ...item,
      percent,
      offset: runningTotal,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
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

      monthlyTotals[key][field] += Number(item.amount);
    });
  }

  addToMonth(salaryData, "income");
  addToMonth(expenseData, "expense");

  const months = Object.keys(monthlyTotals)
    .sort()
    .slice(-6)
    .map((key) => ({
      key,

      label: new Date(`${key}-01`).toLocaleString("en-IN", {
        month: "short",
        year: "2-digit",
      }),

      income: monthlyTotals[key].income,
      expense: monthlyTotals[key].expense,
    }));

  const maxMonthly = Math.max(
    ...months.flatMap((m) => [m.income, m.expense]),
    1,
  );

  return (
    <div className="min-h-screen bg-[#0b0b0a] px-4 pb-10 pt-32 text-gray-100 sm:px-6 lg:ml-60 lg:px-8 lg:pt-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#252321] pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] font-bold tracking-[0.2em] text-[#ff7424]">
              / ANALYTICS / FINANCIAL DATA
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Charts & Analytics
            </h1>

            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Analyze your income, expenses and financial activity through
              visual data.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#713817] bg-[#1b100a] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ff7424] shadow-[0_0_10px_#ff7424]" />
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#ff7424]">
              LIVE DATA
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#252321] bg-[#111110] p-4">
          <p className="font-mono text-[9px] tracking-[0.15em] text-gray-600">
            TOTAL INCOME
          </p>

          <p className="mt-2 text-2xl font-black text-green-400">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-[#252321] bg-[#111110] p-4">
          <p className="font-mono text-[9px] tracking-[0.15em] text-gray-600">
            TOTAL EXPENSE
          </p>

          <p className="mt-2 text-2xl font-black text-[#ff7424]">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl border border-[#252321] bg-[#111110] p-4">
          <p className="font-mono text-[9px] tracking-[0.15em] text-gray-600">
            NET BALANCE
          </p>

          <p
            className={`mt-2 text-2xl font-black ${
              totalIncome - totalExpense >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            ₹{Math.abs(totalIncome - totalExpense).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Income vs Expenses */}
        <div className="rounded-xl border border-[#252321] bg-[#111110] p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="font-mono text-[9px] tracking-[0.15em] text-[#ff7424]">
                CHART 01
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Income vs Expenses
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Total across all records
              </p>
            </div>

            <div className="rounded-md border border-[#252321] px-2 py-1 font-mono text-[9px] text-gray-600">
              TOTAL
            </div>
          </div>

          {totalIncome === 0 && totalExpense === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-[#292726] bg-[#0b0b0a] text-center font-mono text-xs text-gray-600">
              NO FINANCIAL DATA
            </div>
          ) : (
            <div className="flex h-64 items-end justify-center gap-8 rounded-lg border border-[#252321] bg-[#0b0b0a] px-6 pb-5 pt-6 sm:gap-14">
              {/* Income */}
              <div className="flex h-full w-20 flex-col items-center justify-end">
                <span className="mb-2 text-xs font-bold text-green-400">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </span>

                <div
                  className="w-full rounded-t-md bg-green-500 transition-all"
                  style={{
                    height: `${(totalIncome / maxTotal) * 80}%`,
                    minHeight: totalIncome > 0 ? "8px" : "0px",
                  }}
                />

                <span className="mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-600">
                  Income
                </span>
              </div>

              {/* Expense */}
              <div className="flex h-full w-20 flex-col items-center justify-end">
                <span className="mb-2 text-xs font-bold text-[#ff7424]">
                  ₹{totalExpense.toLocaleString("en-IN")}
                </span>

                <div
                  className="w-full rounded-t-md bg-[#ff7424] transition-all"
                  style={{
                    height: `${(totalExpense / maxTotal) * 80}%`,
                    minHeight: totalExpense > 0 ? "8px" : "0px",
                  }}
                />

                <span className="mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-600">
                  Expenses
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Expense Categories */}
        <div className="rounded-xl border border-[#252321] bg-[#111110] p-5 sm:p-6">
          <div className="mb-5">
            <p className="font-mono text-[9px] tracking-[0.15em] text-[#ff7424]">
              CHART 02
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Expense Categories
            </h2>

            <p className="mt-1 text-xs text-gray-600">Where your money goes</p>
          </div>

          {segments.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-[#292726] bg-[#0b0b0a] text-center font-mono text-xs text-gray-600">
              NO EXPENSE DATA
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-7 rounded-lg border border-[#252321] bg-[#0b0b0a] p-5 sm:flex-row">
              {/* Donut */}
              <div className="relative shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  className="h-40 w-40 -rotate-90"
                  role="img"
                  aria-label="Expense categories donut chart"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#252321"
                    strokeWidth="4"
                  />

                  {segments.map((s) => (
                    <circle
                      key={s.category}
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="4"
                      strokeDasharray={`${s.percent} ${100 - s.percent}`}
                      strokeDashoffset={-s.offset}
                    />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-[8px] tracking-widest text-gray-600">
                    TOTAL
                  </span>

                  <span className="text-lg font-black text-white">
                    ₹{totalExpense.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <ul className="w-full space-y-3 sm:min-w-48">
                {segments.map((s) => (
                  <li
                    key={s.category}
                    className="flex items-center justify-between gap-4 border-b border-[#1d1c1a] pb-2 last:border-0"
                  >
                    <span className="flex items-center gap-2 text-xs capitalize text-gray-400">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{
                          backgroundColor: s.color,
                        }}
                      />

                      {s.category}
                    </span>

                    <span className="text-xs font-bold text-gray-200">
                      ₹{s.value.toLocaleString("en-IN")}{" "}
                      <span className="font-normal text-gray-600">
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
      <div className="mt-5 rounded-xl border border-[#252321] bg-[#111110] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.15em] text-[#ff7424]">
              CHART 03
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Monthly Overview
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Income and expenses for the last 6 months
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-wider">
            <span className="flex items-center gap-2 text-gray-500">
              <span className="h-2 w-2 rounded-sm bg-green-500" />
              Income
            </span>

            <span className="flex items-center gap-2 text-gray-500">
              <span className="h-2 w-2 rounded-sm bg-[#ff7424]" />
              Expenses
            </span>
          </div>
        </div>

        {months.length === 0 ? (
          <div className="mt-6 flex h-72 items-center justify-center rounded-lg border border-dashed border-[#292726] bg-[#0b0b0a] text-center font-mono text-xs text-gray-600">
            NO MONTHLY DATA
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg border border-[#252321] bg-[#0b0b0a] p-5">
            <div className="flex min-w-max items-end justify-around gap-8 px-2">
              {months.map((m) => (
                <div
                  key={m.key}
                  className="flex min-w-[55px] flex-col items-center"
                >
                  <div className="flex h-52 items-end gap-1.5">
                    {/* Income */}
                    <div
                      className="w-5 rounded-t-sm bg-green-500 transition-all sm:w-7"
                      style={{
                        height: `${(m.income / maxMonthly) * 100}%`,
                        minHeight: m.income > 0 ? "4px" : "0px",
                      }}
                      title={`Income: ₹${m.income}`}
                    />

                    {/* Expense */}
                    <div
                      className="w-5 rounded-t-sm bg-[#ff7424] transition-all sm:w-7"
                      style={{
                        height: `${(m.expense / maxMonthly) * 100}%`,
                        minHeight: m.expense > 0 ? "4px" : "0px",
                      }}
                      title={`Expenses: ₹${m.expense}`}
                    />
                  </div>

                  <span className="mt-3 font-mono text-[10px] font-bold uppercase text-gray-500">
                    {m.label}
                  </span>

                  <span
                    className={`mt-1 font-mono text-[9px] font-bold ${
                      m.income - m.expense < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {m.income - m.expense < 0 ? "-" : "+"}₹
                    {Math.abs(m.income - m.expense).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status */}
      <div className="mt-5 flex flex-col gap-2 border-t border-[#252321] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[9px] tracking-[0.12em] text-gray-700">
          MYWALLET / ANALYTICS ENGINE
        </p>

        <p className="font-mono text-[9px] text-gray-700">
          {months.length} MONTHS TRACKED
        </p>
      </div>
    </div>
  );
}

export default Charts;
