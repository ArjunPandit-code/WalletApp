import { useEffect, useState } from "react";

function Income(props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [salaryData, setSalaryData] = useState(() => {
    const stored = localStorage.getItem("salaryData");
    return stored ? JSON.parse(stored) : [];
  });

  function storeValue(e) {
    e.preventDefault();

    const arr = [...salaryData];

    arr.push({
      title,
      amount,
      category,
      date,
    });

    setSalaryData(arr);

    localStorage.setItem("salaryData", JSON.stringify(arr));

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  }

  function handleDelete(idx) {
    const deleting = salaryData.filter((_, i) => i !== idx);

    setSalaryData(deleting);

    localStorage.setItem(
      "salaryData",
      JSON.stringify(deleting)
    );
  }

  function totalSalary() {
    let salary = 0;

    salaryData.map((i) => {
      salary += Number(i.amount);
    });

    return salary;
  }

  useEffect(() => {
    props.setIncome(totalSalary());
  }, [salaryData]);

  return (
    <div className="min-h-screen bg-gray-950 px-4 pb-6 pt-32 sm:px-6 lg:ml-60 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Income
        </h1>

        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          Manage your income and earnings
        </p>
      </div>

      {/* Total Income */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mb-8 sm:p-6">

        <p className="text-sm font-medium text-gray-400">
          Total Income
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-400 sm:text-4xl">
          ₹{totalSalary()}
        </h2>

      </div>

      {/* Add Income */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Add Income
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Enter the details of your income
          </p>
        </div>

        <form onSubmit={storeValue}>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Income Title
              </label>

              <input
                type="text"
                placeholder="e.g. Salary"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
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
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
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
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="">Select category</option>
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="business">Business</option>
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
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-950"
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
            className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-500 active:scale-[0.98] sm:w-auto"
          >
            Add Income
          </button>

        </form>
      </div>

      {/* Income History */}
      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:mt-8 sm:p-6">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Income History
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your recorded income
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-950 px-3 py-1 text-sm font-medium text-green-400">
            {salaryData.length} Records
          </span>

        </div>

        {/* No income */}
        {salaryData.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 px-4 py-10 text-center">

            <p className="font-medium text-gray-400">
              No income records yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first income using the form above.
            </p>

          </div>
        )}

        {/* Income Records */}
        <div className="space-y-3">

          {salaryData.map((elem, idx) => (
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

                  <span className="rounded-full bg-green-950 px-2.5 py-1 text-xs font-medium capitalize text-green-400">
                    {elem.category}
                  </span>

                  <span className="text-sm text-gray-400">
                    {elem.date}
                  </span>

                </div>

              </div>

              {/* Amount + Delete */}
              <div className="flex items-center justify-between gap-4 sm:justify-end">

                <span className="text-lg font-bold text-green-400">
                  +₹{elem.amount}
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

export default Income;