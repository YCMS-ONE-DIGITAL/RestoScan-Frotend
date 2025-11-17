import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import GetStartedButton from "./GetStartedButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Apply theme on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // 👈 navbar height adjust kar (try -80 or -90)
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };


  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img
            src="https://restoscan.com/img/logo.png"
            alt="App Logo"
            className="h-8 sm:h-9 mr-2"
          />
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            RestoScan
          </span>
        </a>

        {/* Center Menu (Desktop) */}
        <div className="hidden lg:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("home")}
            className="text-gray-800 hover:text-skin-base dark:text-gray-200 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("icon-features")}
            className="text-gray-800 hover:text-skin-base dark:text-gray-200 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("simple-pricing")}
            className="text-gray-800 hover:text-skin-base dark:text-gray-200 transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("user-faqs")}
            className="text-gray-800 hover:text-skin-base dark:text-gray-200 transition-colors"
          >
            FAQs
          </button>
        </div>

        {/* Right Side Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <a
            href="/login"
            className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Login
          </a>

          <GetStartedButton
            text="Get Started"
            onClick={() => (window.location.href = "/signup")}
          />
        </div>

        {/* Toggle Button (mobile only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden inline-flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          } bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700`}
      >
        <ul className="flex flex-col px-6 py-4 space-y-3 font-medium">

          {/* Menu Links */}
          <li>
            <button
              onClick={() => scrollToSection("home")}
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-skin-base w-full text-left"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("icon-features")}
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-skin-base w-full text-left"
            >
              Features
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("simple-pricing")}
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-skin-base w-full text-left"
            >
              Pricing
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("user-faqs")}
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-skin-base w-full text-left"
            >
              FAQs
            </button>
          </li>

          {/* Divider */}
          <li>
            <hr className="border-gray-200 dark:border-gray-700 my-2" />
          </li>

          {/* Theme Toggle + Login (clean horizontal row) */}
          <li className="flex items-center justify-between">


            <a
              href="#"
              onClick={() => (window.location.href = "/login")}

              className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Login
            </a>
          </li>

          {/* Get Started Button */}
          <li>
            <GetStartedButton
              text="Get Started"
              onClick={() => (window.location.href = "/signup")}
            />
          </li>
        </ul>
      </div>

    </header>
  );
};

export default Navbar;
