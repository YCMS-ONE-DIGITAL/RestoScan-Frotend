// src/components/layout/DashboardLayout.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import api from "@/api/api";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

useEffect(() => {
  api
    .head("/user/me")
    .then(() => {
      setAuth(true);
    })
    .catch(() => {
      setAuth(false);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0E1421] text-white">
        Checking authentication...
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-[#0E1421] text-white min-h-screen">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Sidebar (Mobile) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent side="left" className="p-0 bg-[#121826] text-white">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar onMenuToggle={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
