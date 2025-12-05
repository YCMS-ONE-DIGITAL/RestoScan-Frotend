// src/components/layout/DashboardLayout.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import api from "@/api/api";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TopToaster from "../TopToaster";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    api
      .head("/user/me")
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

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-[#0E1421] text-white h-screen overflow-hidden">
              <TopToaster />

      {/* ✅ Sidebar - Desktop */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* ✅ Sidebar - Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent side="left" className="p-0 bg-[#121826] text-white">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ✅ MAIN AREA */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <Topbar onMenuToggle={() => setOpen(true)} />

  <main
  className="flex-1 overflow-y-auto min-h-0"
  style={{ height: "calc(100vh - 56px)", padding: "0 1.5rem" }}
>
  <Outlet />
</main>

      </div>
    </div>
  );
}
