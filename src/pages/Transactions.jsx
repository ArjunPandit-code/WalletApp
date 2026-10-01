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
      window.removeEventListener(
        "storage",
        syncData
      );

      window.removeEventListener(
        "focus",
        syncData
      );
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
      index,
    })),
  ].sort((a, b) => {

    const dateA = a.date
      ? new Date(a.date).getTime()
      : 0;

    const dateB = b.date
      ? new Date(b.date).getTime()
      : 0;

    return dateB - dateA;
  });

  const filteredTransactions =
    allTransactions.filter((t) => {

      const query = searched
        .trim()
        .toLowerCase();

      const matchesSearch =
        query === "" ||
        (t.title || "")
          .toLowerCase()
          .includes(query) ||
        (t.category || "")
          .toLowerCase()
          .includes(query);

      const matchesType =
        type === "" || t.type === type;

      const matchesCategory =
        categories === "" ||
        t.category === categories;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory
      );
    });

  function handleDelete(t) {

    if (t.type === "income") {

      const updated = salaryData.filter(
        (_, i) => i !== t.index
      );

      setSalaryData(updated);

      localStorage.setItem(
        "salaryData",
        JSON.stringify(updated)
      );

    } else {

      const updated = expenseData.filter(
        (_, i) => i !== t.index
      );

      setExpenseData(updated);

      localStorage.setItem(
        "expenseData",
        JSON.stringify(updated)
      );

    }
  }

  function clearFilters() {
    setSearched("");
    setType("");
    setCategories("");
  }

  const hasFilters =
    searched !== "" ||
    type !== "" ||
    categories !== "";

  return (
    <div className="min-h-screen bg-gray-950 p-4 pt-32 sm:p-6 sm:pt-32 lg:ml-60 lg:p-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          View and manage all your transactions
        </p>

      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Search */}
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
            value={searched}
            onChange={(e) =>
              setSearched(e.target.value)
            }
          />

          {/* Type */}
          <select
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>

          </select>

          {/* Category */}
          <select
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
            value={categories}
            onChange={(e) =>
              setCategories(e.target.value)
            }
          >

            <option value="">
              All Categories
            </option>

            <option value="food">Food</option>
            <option value="shopping">
              Shopping
            </option>
            <option value="transport">
              Transport
            </option>
            <option value="entertainment">
              Entertainment
            </option>
            <option value="education">
              Education
            </option>
            <option value="bills">Bills</option>
            <option value="salary">Salary</option>
            <option value="freelance">
              Freelance
            </option>
            <option value="business">
              Business
            </option>
            <option value="other">Other</option>

          </select>

        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-green-400 transition hover:bg-green-950"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

        {/* Header */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Income and expenses, latest first
            </p>

          </div>

          <span className="w-fit rounded-full bg-green-950 px-3 py-1 text-sm font-medium text-green-400">
            {filteredTransactions.length} Records
          </span>

        </div>

        {/* Empty */}
        {filteredTransactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 px-4 py-10 text-center">

            <p className="font-medium text-gray-400">

              {hasFilters
                ? "No transactions match your filters"
                : "No transactions yet"}

            </p>

            <p className="mt-1 text-sm text-gray-500">

              {hasFilters
                ? "Try a different search or clear the filters."
                : "Add income or expenses and they will show up here."}

            </p>

          </div>
        )}

        {/* Records */}
        <div className="space-y-3">

          {filteredTransactions.map((t) => {

            const isIncome =
              t.type === "income";

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
                    <span className="text-sm text-gray-400">
                      {t.date}
                    </span>

                  </div>

                </div>

                {/* Amount */}
                <div className="flex items-center justify-between gap-4 sm:justify-end">

                  <span
                    className={`text-lg font-bold ${
                      isIncome
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹
                    {t.amount}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(t)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950 hover:text-red-300"
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