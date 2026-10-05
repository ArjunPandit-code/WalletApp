import React, { useState } from "react";

function Expenses() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState("");

  const [expenseData, setexpenseData] = useState(() => {
    const stored = localStorage.getItem("expenseData");
    return stored ? JSON.parse(stored) : [];
  });

  function saveData(e) {
    e.preventDefault();

    const arr = [...expenseData];

    arr.push({
      title,
      amount,
      categories,
      date,
    });

    setexpenseData(arr);

    localStorage.setItem("expenseData", JSON.stringify(arr));

    setTitle("");
    setAmount("");
    setDate("");
    setCategories("");
  }

  function handleDelete(idx) {
    const deletee = expenseData.filter((_, i) => i !== idx);

    setexpenseData(deletee);

    localStorage.setItem("expenseData", JSON.stringify(deletee));
  }

  function totalExpense() {
    let expense = 0;

    expenseData.map((i) => {
      expense += Number(i.amount);
    });

    return expense;
  }

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0a] px-4 pb-10 pt-32 text-white sm:px-6 lg:ml-60 lg:px-8 lg:pt-5">
      {/* HEADER */}

      <div className="mb-7 flex flex-col gap-4 border-b border-[#252321] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#ff7424]">
              / EXPENSES
            </span>

            <span className="text-gray-700">/</span>

            <span className="font-mono text-[10px] tracking-widest text-gray-600">
              EXPENDITURE SYSTEM
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-100 sm:text-3xl">
            Expense Management
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Track and control your outgoing funds.
          </p>
        </div>

        <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-red-500">
          MONITOR: ACTIVE
        </div>
      </div>

      {/* STATS */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* TOTAL EXPENSE */}

        <div className="rounded-2xl border border-[#703a17] bg-[#12110f] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-gray-500">
              TOTAL OUTFLOW
            </p>

            <div className="rounded-lg bg-[#2a1210] px-3 py-2 text-red-500">
              ↘
            </div>
          </div>

          <h2 className="text-3xl font-black text-[#ff7424] sm:text-4xl">
            ₹{formatAmount(totalExpense())}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            Calculated from all expense records
          </p>
        </div>

        {/* RECORDS */}

        <div className="rounded-2xl border border-[#292726] bg-[#121110] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-gray-500">
              ACTIVE RECORDS
            </p>

            <div className="rounded-lg bg-[#2a1210] px-3 py-2 text-red-500">
              #
            </div>
          </div>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            {expenseData.length}
          </h2>

          <p className="mt-2 text-xs text-gray-600">
            Expense entries stored locally
          </p>
        </div>
      </div>

      {/* ADD EXPENSE */}

      <div className="mb-6 rounded-2xl border border-[#292726] bg-[#111110] p-5 sm:p-6">
        <div className="mb-6 border-b border-[#252321] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a1210] text-red-500">
              −
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-200">Add Expense</h2>

              <p className="text-xs text-gray-600">
                Create a new expenditure record
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={saveData}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* TITLE */}

            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
                EXPENSE TITLE
              </label>

              <input
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="w-full rounded-lg border border-[#302d2a] bg-[#171615] px-4 py-3 text-sm text-gray-200 outline-none transition placeholder:text-gray-700 focus:border-[#ff7424] focus:bg-[#1a1816]"
              />
            </div>

            {/* AMOUNT */}

            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
                AMOUNT
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-red-500">
                  ₹
                </span>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  className="w-full rounded-lg border border-[#302d2a] bg-[#171615] py-3 pl-9 pr-4 text-sm text-gray-200 outline-none transition placeholder:text-gray-700 focus:border-[#ff7424] focus:bg-[#1a1816]"
                />
              </div>
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
                CATEGORY
              </label>

              <select
                value={categories}
                onChange={(e) => {
                  setCategories(e.target.value);
                }}
                className="w-full rounded-lg border border-[#302d2a] bg-[#171615] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#ff7424]"
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

            {/* DATE */}

            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
                DATE
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                className="w-full rounded-lg border border-[#302d2a] bg-[#171615] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#ff7424]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-[#ff7424] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff853d] active:scale-[0.98]"
          >
            − Add Expense
          </button>
        </form>
      </div>

      {/* EXPENSE HISTORY */}

      <div className="rounded-2xl border border-[#292726] bg-[#111110] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-[#252321] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-red-500">◷</span>

              <h2 className="text-lg font-bold text-gray-200">
                Expense History
              </h2>
            </div>

            <p className="mt-1 text-xs text-gray-600">
              All recorded expenditure transactions
            </p>
          </div>

          <span className="w-fit rounded-md border border-[#302d2a] bg-[#171615] px-3 py-1.5 font-mono text-[10px] text-gray-500">
            {expenseData.length} RECORDS
          </span>
        </div>

        {expenseData.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[#292726] text-center">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                No expense records
              </p>

              <p className="mt-1 text-xs text-gray-700">
                Add your first expense using the form above.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {expenseData.map((elem, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 rounded-xl border border-[#242220] bg-[#151413] p-4 transition hover:border-[#463125] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2a1210] text-red-500">
                    ↘
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-200">
                      {elem.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-md border border-[#302d2a] bg-[#1a1816] px-2 py-1 text-[10px] capitalize text-gray-500">
                        {elem.categories}
                      </span>

                      <span className="text-[10px] text-gray-600">
                        {elem.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-base font-bold text-[#ff7424]">
                    -₹{formatAmount(elem.amount)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="rounded-md border border-transparent px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
