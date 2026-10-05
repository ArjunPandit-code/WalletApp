import { useEffect, useState } from "react";

function Transactions() {
  const [searched, setSearched] = useState("");
  const [categories, setCategories] = useState("");
  const [type, setType] = useState("");

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

  const allTransactions = [
    ...salaryData.map((item, index) => ({
      ...item,
      type: "income",
      index,
    })),

    ...expenseData.map((item, index) => ({
      ...item,
      type: "expense",
      category: item.categories,
      index,
    })),
  ].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;

    return dateB - dateA;
  });

  const filteredTransactions = allTransactions.filter((t) => {
    const query = searched.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      (t.title || "").toLowerCase().includes(query) ||
      (t.category || "").toLowerCase().includes(query);

    const matchesType = type === "" || t.type === type;

    const matchesCategory = categories === "" || t.category === categories;

    return matchesSearch && matchesType && matchesCategory;
  });

  function handleDelete(t) {
    if (t.type === "income") {
      const updated = salaryData.filter((_, i) => i !== t.index);

      setSalaryData(updated);

      localStorage.setItem("salaryData", JSON.stringify(updated));
    } else {
      const updated = expenseData.filter((_, i) => i !== t.index);

      setExpenseData(updated);

      localStorage.setItem("expenseData", JSON.stringify(updated));
    }
  }

  function clearFilters() {
    setSearched("");
    setType("");
    setCategories("");
  }

  const hasFilters = searched !== "" || type !== "" || categories !== "";

  return (
    <div className="min-h-screen bg-[#0b0b0a] px-4 pb-10 pt-32 text-white sm:px-6 lg:ml-60 lg:px-8 lg:pt-5">
      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col gap-4 border-b border-[#252321] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#ff7424]">
              / TRANSACTIONS
            </span>

            <span className="text-gray-700">/</span>

            <span className="font-mono text-[10px] tracking-widest text-gray-600">
              LEDGER SYSTEM
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-100 sm:text-3xl">
            Transaction Ledger
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            View and manage your complete financial history.
          </p>
        </div>

        <div className="rounded-lg border border-[#713817] bg-[#1d120b] px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-[#ff7424]">
          {allTransactions.length} TOTAL
        </div>
      </div>

      {/* ================= FILTER PANEL ================= */}

      <div className="mb-6 rounded-2xl border border-[#292726] bg-[#111110] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-[#252321] pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#21150f] text-[#ff7424]">
            ⌕
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-200">Filter Ledger</h2>

            <p className="text-xs text-gray-600">
              Search and filter your transactions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* SEARCH */}

          <div>
            <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
              SEARCH
            </label>

            <input
              type="text"
              placeholder="Search transactions..."
              value={searched}
              onChange={(e) => setSearched(e.target.value)}
              className="w-full rounded-lg border border-[#302d2a] bg-[#171615] px-4 py-3 text-sm text-gray-200 outline-none transition placeholder:text-gray-700 focus:border-[#ff7424]"
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
              TYPE
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-[#302d2a] bg-[#171615] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#ff7424]"
            >
              <option value="">All Types</option>

              <option value="income">Income</option>

              <option value="expense">Expense</option>
            </select>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block font-mono text-[10px] font-bold tracking-widest text-gray-500">
              CATEGORY
            </label>

            <select
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="w-full rounded-lg border border-[#302d2a] bg-[#171615] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#ff7424]"
            >
              <option value="">All Categories</option>

              <option value="food">Food</option>

              <option value="shopping">Shopping</option>

              <option value="transport">Transport</option>

              <option value="entertainment">Entertainment</option>

              <option value="education">Education</option>

              <option value="bills">Bills</option>

              <option value="salary">Salary</option>

              <option value="freelance">Freelance</option>

              <option value="business">Business</option>

              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* CLEAR FILTERS */}

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg border border-[#493024] bg-[#1d120b] px-3 py-2 text-xs font-medium text-[#ff7424] transition hover:bg-[#28180f]"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ================= TRANSACTIONS ================= */}

      <div className="rounded-2xl border border-[#292726] bg-[#111110] p-5 sm:p-6">
        {/* HEADER */}

        <div className="mb-5 flex flex-col gap-3 border-b border-[#252321] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#ff7424]">◷</span>

              <h2 className="text-lg font-bold text-gray-200">
                All Transactions
              </h2>
            </div>

            <p className="mt-1 text-xs text-gray-600">
              Income and expenses, latest first
            </p>
          </div>

          <span className="w-fit rounded-md border border-[#302d2a] bg-[#171615] px-3 py-1.5 font-mono text-[10px] text-gray-500">
            {filteredTransactions.length} RECORDS
          </span>
        </div>

        {/* EMPTY */}

        {filteredTransactions.length === 0 && (
          <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-[#292726] text-center">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                {hasFilters
                  ? "No transactions match your filters"
                  : "No transactions yet"}
              </p>

              <p className="mt-1 text-xs text-gray-700">
                {hasFilters
                  ? "Try a different search or clear the filters."
                  : "Add income or expenses and they will appear here."}
              </p>
            </div>
          </div>
        )}

        {/* RECORDS */}

        <div className="space-y-2">
          {filteredTransactions.map((t) => {
            const isIncome = t.type === "income";

            return (
              <div
                key={`${t.type}-${t.index}`}
                className="flex flex-col gap-4 rounded-xl border border-[#242220] bg-[#151413] p-4 transition hover:border-[#463125] sm:flex-row sm:items-center sm:justify-between"
              >
                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      isIncome
                        ? "bg-[#0b2918] text-green-500"
                        : "bg-[#2a1210] text-[#ff7424]"
                    }`}
                  >
                    {isIncome ? "↗" : "↘"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-200">
                      {t.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {/* TYPE */}

                      <span
                        className={`rounded-md border px-2 py-1 text-[10px] font-medium capitalize ${
                          isIncome
                            ? "border-green-900/50 bg-green-950/30 text-green-500"
                            : "border-red-900/50 bg-red-950/30 text-red-500"
                        }`}
                      >
                        {t.type}
                      </span>

                      {/* CATEGORY */}

                      <span className="rounded-md border border-[#302d2a] bg-[#1a1816] px-2 py-1 text-[10px] capitalize text-gray-500">
                        {t.category || "Other"}
                      </span>

                      {/* DATE */}

                      <span className="text-[10px] text-gray-600">
                        {t.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`text-base font-bold ${
                      isIncome ? "text-green-500" : "text-[#ff7424]"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹
                    {Number(t.amount).toLocaleString("en-IN")}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(t)}
                    className="rounded-md border border-transparent px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
