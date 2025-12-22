// src/components/layout/DashboardLayout.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar"
import api from "@/api/api";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import TopToaster from "../TopToaster";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    api
      .get("/user/me")
      .then(() => setAuth(true))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0E1421] text-white">
        Checking authentication...
      </div>
    );
  }

  if (!auth) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#0E1421] text-white overflow-hidden">
      <TopToaster />

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden md:block w-64 border-r border-white/10 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-[#121826]">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar - Fixed */}
        <TopBar onMenuToggle={() => setOpen(true)} />
        {/* <TopBar */}
        {/* Main Content - Only This Scrolls */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}