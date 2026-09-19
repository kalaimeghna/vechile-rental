import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Menu, Bell, User as UserIcon } from "lucide-react";
import Sidebar from "./Sidebar";

// =========================================================
// TYPES
// =========================================================

interface DashboardLayoutProps {
  children?: ReactNode;
}

// =========================================================
// DASHBOARD LAYOUT
// =========================================================

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Retrieve user info safely from localStorage if stored during login
  const storedUser = localStorage.getItem("user");
  const userName = storedUser
    ? JSON.parse(storedUser).name || "Owner"
    : "Owner";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ===================================================
          SIDEBAR (Desktop & Mobile Responsive)
      ==================================================== */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* ===================================================
          MAIN CONTENT AREA CONTAINER
      ==================================================== */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 h-20 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Mobile Toggle & Greeting */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Here's what's happening with your vehicle rentals today.
              </p>
            </div>
          </div>

          {/* Right Actions: Notifications & Profile Shortcut */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/notifications")}
              className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification indicator dot */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() => navigate("/owner/profile")}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-left hidden md:block">
                <span className="block text-sm font-semibold text-gray-800">
                  {userName}
                </span>
                <span className="block text-xs text-gray-500">Fleet Owner</span>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
