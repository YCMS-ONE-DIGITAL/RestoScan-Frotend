// src/components/layout/Topbar.jsx
import { Menu, Rocket, Sun } from "lucide-react";

export default function Topbar({ onMenuToggle }) {
  return (
    <header className="flex justify-between items-center bg-[#1C2333] text-white px-4 md:px-6 py-3 border-b border-gray-700">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded hover:bg-[#2B3348]"
        onClick={onMenuToggle}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <button className="bg-purple-700 text-white px-3 py-1.5 rounded-md text-sm">
          Today Orders <span className="ml-2 bg-white text-purple-700 px-2 rounded">0</span>
        </button>
        <button className="hidden sm:flex bg-[#2B3348] px-3 py-1.5 rounded-md items-center gap-2 hover:bg-indigo-600 text-sm">
          <Rocket className="w-4 h-4" /> Upgrade Plan
        </button>
        <Sun className="w-5 h-5 text-gray-300" />
        <div className="bg-gray-300 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          AB
        </div>
      </div>
    </header>
  );
}
