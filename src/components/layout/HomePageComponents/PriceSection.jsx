import React from "react";

const PriceSection = () => {
  const leftFeatures = [
    "Unlimited Orders & Reservations",
    "Menu Management",
    "QR Code Menu",
    "Payment Gateway Integration",
    "POS System",
    "Multiple Branches",
    "Export to Excel",
    "Custom Floor Plans",
  ];

  const rightFeatures = [
    "Staff Management",
    "Kitchen Order Tickets (KOT)",
    "Reports & Analytics",
    "Customer Support",
    "Add Business Logo & Theme",
    "Table Reservations",
    "Payment Gateway Integration",
  ];

  return (
    <section
      id="simple-pricing"
      className="w-full bg-gray-50 dark:bg-gray-900 py-16 px-6 sm:px-10 lg:px-16 "
    >
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get everything you need to manage your restaurant with one affordable
          plan.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-md p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                1 Year Premium Plan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                All-in-One Restaurant Management Plan
              </p>
            </div>

            <div className="mt-4 sm:mt-0 text-right">
              <span className="text-5xl font-bold text-gray-800 dark:text-white">
                $49
              </span>
              <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                .00
              </span>
              <span className="ms-2 text-gray-500 dark:text-gray-400">USD</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-neutral-700 my-6"></div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[leftFeatures, rightFeatures].map((list, colIndex) => (
              <ul key={colIndex} className="space-y-3">
                {list.map((item, index) => (
                  <li key={index} className="flex items-start gap-x-3">
                    <span className="flex justify-center items-center w-6 h-6 rounded-full bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-400 flex-shrink-0">
                      <svg
                        className="w-3.5 h-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* Button */}
          <div className="flex justify-center sm:justify-end mt-10">
            <a
              href="https://restoscan.com/restaurant-signup"
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-900"
            >
              Get Started for Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
