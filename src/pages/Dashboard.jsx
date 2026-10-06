import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  function loadData() {
    const income = localStorage.getItem("salaryData");
    const expense = localStorage.getItem("expenseData");

    setIncomeData(income ? JSON.parse(income) : []);
    setExpenseData(expense ? JSON.parse(expense) : []);
  }

  useEffect(() => {
    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // ---------------- TOTALS ----------------

  const totalIncome = incomeData.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const totalExpense = expenseData.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const balance = totalIncome - totalExpense;

  // ---------------- TRANSACTIONS ----------------

  const transactions = [
    ...incomeData.map((item, index) => ({
      ...item,
      type: "income",
      index,
    })),

    ...expenseData.map((item, index) => ({
      ...item,
      type: "expense",
      index,
      category: item.categories,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0a] px-4 pb-10 pt-24 text-white sm:px-6 lg:ml-60 lg:px-8 lg:pt-3">

      {/* ================= TOP HEADER ================= */}

      <div className="mb-7 flex flex-col gap-4 border-b border-[#252321] pb-5">
        <div className="flex items-center gap-3">
          <span className="rounded border border-[#6d3516] bg-[#21150f] px-3 py-1 text-[10px] font-bold tracking-widest text-[#ff7424]">
            / DASHBOARD
          </span>

          <h1 className="text-lg font-bold text-gray-200 sm:text-xl">
            Financial Overview
          </h1>
        </div>
      </div>

      {/* ================= HERO ================= */}

      <div className="mb-7 overflow-hidden rounded-2xl border border-[#292521] bg-gradient-to-br from-[#151310] to-[#0f0f0e] px-6 py-7 sm:px-8 sm:py-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[#ff7424]">☆</span>

          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#ff7424]">
            SYSTEM STATUS: Ghee Khatam
          </span>
        </div>

        <h2 className="max-w-2xl text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
          Your<span className="text-[#ff7424]"> Personal</span>
          <br />
          Financial Dashboard.
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Track your income, expenses, and balance in one place. Get insights
        </p>
      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* BALANCE */}

        <div className="rounded-2xl border border-[#703a17] bg-[#12110f] p-5 shadow-[0_0_25px_rgba(255,116,36,0.03)]">
          <div className="mb-5 flex items-start justify-between">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-gray-500">
              NET TOTAL BALANCE
            </p>

            <div className="rounded-lg bg-[#29180d] p-2 text-[#ff7424]">
              ₹
            </div>
          </div>

          <h3
            className={`text-3xl font-black sm:text-4xl ${
              balance >= 0 ? "text-white" : "text-red-500"
            }`}
          >
            ₹{formatAmount(balance)}
          </h3>

          <p className="mt-2 text-xs text-gray-600">
            Calculated: Income minus Expenses
          </p>
        </div>

        {/* INCOME */}

        <div className="rounded-2xl border border-[#292726] bg-[#121110] p-5">
          <div className="mb-5 flex items-start justify-between">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-gray-500">
              TOTAL INFLOW
            </p>

            <div className="rounded-lg bg-[#0b2918] px-2.5 py-2 text-green-400">
              ↗
            </div>
          </div>

          <h3 className="text-3xl font-black text-green-500 sm:text-4xl">
            ₹{formatAmount(totalIncome)}
          </h3>

          <p className="mt-2 text-xs font-semibold text-green-500">
            • {incomeData.length} incoming stream
            {incomeData.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* EXPENSE */}

        <div className="rounded-2xl border border-[#292726] bg-[#121110] p-5">
          <div className="mb-5 flex items-start justify-between">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-gray-500">
              TOTAL OUTFLOW
            </p>

            <div className="rounded-lg bg-[#2a1210] px-2.5 py-2 text-red-500">
              ↘
            </div>
          </div>

          <h3 className="text-3xl font-black text-[#ff7424] sm:text-4xl">
            ₹{formatAmount(totalExpense)}
          </h3>

          <p className="mt-2 text-xs font-semibold text-red-500">
            • {expenseData.length} expenditure record
            {expenseData.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">

        {/* ================= RECENT TRANSACTIONS ================= */}

        <div className="rounded-2xl border border-[#252422] bg-[#111110] p-5">
          <div className="mb-4 flex items-center justify-between border-b border-[#282624] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#ff7424]">◷</span>

              <h2 className="text-base font-bold text-gray-200">
                Recent Transactions
              </h2>
            </div>

            <button
              onClick={() => {
                window.location.href = "/transactions";
              }}
              className="rounded-md border border-[#302d2a] bg-[#171615] px-3 py-1 text-[10px] font-semibold text-gray-300 transition hover:border-[#ff7424] hover:text-white"
            >
              View All
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="flex min-h-[260px] items-center justify-center text-center">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  No transactions yet
                </p>

                <p className="mt-1 text-xs text-gray-700">
                  Add income or expenses to see them here.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {transactions.map((item, index) => (
                <div
                  key={`${item.type}-${item.index}-${index}`}
                  className="flex items-center gap-3 border-b border-[#211f1d] py-4 last:border-b-0"
                >
                  {/* DOT */}

                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      item.type === "income"
                        ? "bg-green-500"
                        : "bg-[#ff7424]"
                    }`}
                  />

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-300">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-600">
                      {item.date}
                    </p>
                  </div>

                  {/* CATEGORY */}

                  <span className="hidden rounded-md border border-[#302d2a] bg-[#171615] px-2 py-1 text-[10px] capitalize text-gray-500 sm:block">
                    {item.category || item.categories || "Other"}
                  </span>

                  {/* AMOUNT */}

                  <span
                    className={`whitespace-nowrap text-sm font-bold ${
                      item.type === "income"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}₹
                    {formatAmount(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RUNTIME PANEL ================= */}

        <div className="overflow-hidden rounded-2xl border border-[#252422] bg-[#111110]">

          {/* PANEL HEADER */}

          <div className="flex items-center justify-between border-b border-[#282624] px-5 py-4">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2d2925]" />
              <span className="h-2 w-2 rounded-full bg-[#2d2925]" />
              <span className="h-2 w-2 rounded-full bg-[#2d2925]" />
            </div>

            <span className="font-mono text-[10px] text-gray-600">
              engine.runtime.js
            </span>
          </div>

          {/* CODE AREA */}

          <div className="min-h-[245px] px-5 py-5 font-mono text-xs leading-6">
            <p className="text-[#ff7424]">
              const walletMetrics = {"{"}
            </p>

            <p className="pl-4 text-gray-500">
              inflowRate:{" "}
              <span className="text-green-500">
                "₹{formatAmount(totalIncome)}"
              </span>
              ,
            </p>

            <p className="pl-4 text-gray-500">
              outflowRate:{" "}
              <span className="text-[#ff7424]">
                "₹{formatAmount(totalExpense)}"
              </span>
              ,
            </p>

            <p className="pl-4 text-gray-500">
              netEquilibrium:{" "}
              <span
                className={
                  balance >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                "₹{formatAmount(balance)}"
              </span>
              ,
            </p>

            <p className="pl-4 text-gray-500">
              healthyRatio:{" "}
              <span className="text-blue-400">
                {totalIncome > 0
                  ? Math.round((balance / totalIncome) * 100)
                  : 0}
                %
              </span>
            </p>

            <p className="text-gray-500">{"};"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;