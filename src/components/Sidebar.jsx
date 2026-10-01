import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-50 w-full border-b border-gray-800 bg-gray-950 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">

      {/* Logo */}
      <div className="px-5 py-4 lg:px-6 lg:pt-7">
        <h2 className="text-2xl font-bold text-white">
          MyWallet
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-20 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-4 lg:pb-0">

        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-xl px-5 py-3 text-base font-medium transition-all duration-200 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:translate-x-1 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        {/* Income */}
        <NavLink
          to="/income"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-xl px-5 py-3 text-base font-medium transition-all duration-200 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:translate-x-1 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Income
        </NavLink>

        {/* Expenses */}
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-xl px-5 py-3 text-base font-medium transition-all duration-200 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:translate-x-1 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Expenses
        </NavLink>

        {/* Transactions */}
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-xl px-5 py-3 text-base font-medium transition-all duration-200 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:translate-x-1 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Transactions
        </NavLink>

        {/* Budget */}
        <NavLink
          to="/budget"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-xl px-5 py-3 text-base font-medium transition-all duration-200 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:translate-x-1 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Budget
        </NavLink>

        {/* Charts */}
        <NavLink
          to="/charts"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-xl px-5 py-3 text-base font-medium transition-all duration-200 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:translate-x-1 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Charts
        </NavLink>

      </div>

    </div>
  );
}

export default Sidebar;