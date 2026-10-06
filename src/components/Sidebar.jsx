import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import walletImage from "../assets/wallet-clip-art-png.png";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    function handleScroll() {
      if (window.innerWidth < 1024) {
        setShowSidebar(window.scrollY <= 50);
      } else {
        setShowSidebar(true);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      }
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/", icon: "▦" },
    { name: "Income", path: "/income", icon: "⌁" },
    { name: "Expenses", path: "/expenses", icon: "⌁" },
    { name: "Transactions", path: "/transactions", icon: "⇄" },
    { name: "Budget", path: "/budget", icon: "$" },
    { name: "Charts", path: "/charts", icon: "⌁" },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        w-full
        border-b border-[#252321]
        bg-[#111110]
        transition-transform duration-300

        ${showSidebar ? "translate-y-0" : "-translate-y-full"}

        lg:h-screen
        lg:w-60
        lg:border-b-0
        lg:border-r
        lg:translate-y-0
      `}
    >
      <div
        className="
          flex h-[68px] items-center
          border-b border-[#252321]
          px-4
          lg:h-auto
          lg:px-5
          lg:py-5
          gap-5
        "
      >
        {/* LOGO */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff7424] shadow-[0_0_18px_rgba(255,116,36,0.2)]">
            <img
              src={walletImage}
              alt="Wallet"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div>
            <h2 className="text-lg font-black leading-none text-gray-100">
              Gareeb<span className="text-[#ff7424]">Wallet</span>
            </h2>

            <p className="mt-1 font-mono text-[8px] tracking-[0.15em] text-gray-600">
              GHEE ENGINE
            </p>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="ml-8 flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex shrink-0 items-center gap-2 rounded-lg border
                px-3 py-2.5 text-[15px] font-medium transition-all duration-200
                ${
                  isActive
                    ? "border-[#713817] bg-[#28180f] text-white"
                    : "border-transparent text-gray-500 hover:bg-[#1a1816] hover:text-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex w-5 shrink-0 items-center justify-center text-base ${
                      isActive
                        ? "text-[#ff7424]"
                        : "text-gray-500 group-hover:text-[#ff7424]"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden px-2 py-3 lg:mt-5 lg:block">
        <p className="mb-3 px-2 font-mono text-[9px] font-bold tracking-[0.18em] text-gray-600">
          NAVIGATION SYSTEM
        </p>

        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg border
                px-3 py-2.5 text-[15px] font-medium transition-all duration-200
                ${
                  isActive
                    ? "border-[#713817] bg-[#28180f] text-white"
                    : "border-transparent text-gray-500 hover:bg-[#1a1816] hover:text-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex w-5 shrink-0 items-center justify-center text-base ${
                      isActive
                        ? "text-[#ff7424]"
                        : "text-gray-500 group-hover:text-[#ff7424]"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;