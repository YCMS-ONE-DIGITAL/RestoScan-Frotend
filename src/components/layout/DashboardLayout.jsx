// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-[#0E1421] text-white min-h-screen">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Sidebar (Mobile) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* Controlled by Topbar’s button */}
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-[#121826] text-white">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar onMenuToggle={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}
