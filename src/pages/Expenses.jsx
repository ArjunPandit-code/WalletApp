import React, { useEffect, useState } from "react";

function Expenses(props) {
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
      category: categories,
      date,
    });

    setexpenseData(arr);

    localStorage.setItem(
      "expenseData",
      JSON.stringify(arr)
    );

    setTitle("");
    setAmount("");
    setDate("");
    setCategories("");
  }

  function handleDelete(idx) {
    const deletee = expenseData.filter((_, i) => i !== idx);

    setexpenseData(deletee);

    localStorage.setItem(
      "expenseData",
      JSON.stringify(deletee)
    );
  }

  function totalExpense() {
    let expense = 0;

    expenseData.map((i) => {
      expense += Number(i.amount);
    });

    return expense;
  }

  useEffect(() => {
    props.setExpense(totalExpense());
  }, [expenseData]);

  return (
   <div className="min-h-screen bg-gray-950 px-4 pb-8 pt-24 sm:px-6 sm:pt-24 lg:ml-60 lg:px-8 lg:pt-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Manage your expenses and spending
        </p>

      </div>

      {/* Total Expenses */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mb-8 sm:p-6">

        <p className="text-sm font-medium text-gray-400">
          Total Expenses
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-400 sm:text-4xl">
          ₹{totalExpense()}
        </h2>

      </div>

      {/* Add Expense */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-white">
            Add Expense
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Enter the details of your expense
          </p>

        </div>

        <form onSubmit={saveData}>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Title */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Expense Title
              </label>

              <input
                type="text"
                placeholder="e.g. Grocery Shopping"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-950"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />

            </div>

            {/* Amount */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Amount
              </label>

              <input
                type="number"
                placeholder="Enter amount"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-950"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />

            </div>

            {/* Category */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Category
              </label>

              <select
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-950"
                value={categories}
                onChange={(e) => {
                  setCategories(e.target.value);
                }}
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

            {/* Date */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Date
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-950"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />

            </div>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-500 active:scale-[0.98] sm:w-auto"
          >
            Add Expense
          </button>

        </form>

      </div>

      {/* Expense History */}
      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mt-8 sm:p-6">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Expense History
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your recorded expenses
            </p>

          </div>

          <span className="w-fit rounded-full bg-red-950 px-3 py-1 text-sm font-medium text-red-400">
            {expenseData.length} Records
          </span>

        </div>

        {/* Empty */}
        {expenseData.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 px-4 py-10 text-center">

            <p className="font-medium text-gray-400">
              No expense records yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first expense using the form above.
            </p>

          </div>
        )}

        {/* Records */}
        <div className="space-y-3">

          {expenseData.map((elem, idx) => (

            <div
              key={idx}
              className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-800 p-4 transition hover:bg-gray-700 sm:flex-row sm:items-center sm:justify-between"
            >

              {/* Information */}
              <div className="min-w-0">

                <h3 className="truncate text-base font-semibold text-gray-100">
                  {elem.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-red-950 px-2.5 py-1 text-xs font-medium capitalize text-red-400">
                    {elem.category}
                  </span>

                  <span className="text-sm text-gray-400">
                    {elem.date}
                  </span>

                </div>

              </div>

              {/* Amount + Delete */}
              <div className="flex items-center justify-between gap-4 sm:justify-end">

                <span className="text-lg font-bold text-red-400">
                  -₹{elem.amount}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950 hover:text-red-300"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Expenses;