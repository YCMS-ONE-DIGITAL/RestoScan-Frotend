// src/components/layout/Topbar.jsx

import { Menu, Sun } from "lucide-react";

export default function Topbar({ onMenuToggle }) {
  return (
    <header className="flex items-center justify-between bg-[#1C2333] px-4 md:px-6 py-3 border-b border-white/10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="hidden md:block text-lg font-semibold text-gray-200">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* <Sun className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition" /> */}
      </div>
    </header>
  );
}
