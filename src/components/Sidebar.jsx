import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import walletImage from "../assets/wallet-clip-art-png.png";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full border-b border-gray-800 bg-gray-950 transition-transform duration-300
      ${showSidebar ? "translate-y-0" : "-translate-y-full"}
      lg:h-screen lg:w-60 lg:border-b-0 lg:border-r`}
    >
      {/* Logo */}
      <div className="hidden px-6 py-3 lg:block ">
        <div className="flex items-center gap-3">
          <img
            src={walletImage}
            alt="Wallet"
            className="h-12 w-12 object-contain"
          />

          <h2 className="text-2xl font-bold text-white">
            MyWallet
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-20 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-4 lg:py-0">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/income"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Income
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Expenses
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Transactions
        </NavLink>

        <NavLink
          to="/budget"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Budget
        </NavLink>

        <NavLink
          to="/charts"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-lg ${
              isActive
                ? "bg-green-950 text-green-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
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