// src/components/owner/Sidebar.tsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Star,
  IndianRupee,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

// =========================================================
// MENU ITEMS
// =========================================================

const menuItems = [
  {
    label: "Dashboard",
    path: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Vehicles",
    path: "/owner/vehicles",
    icon: Car,
  },
  {
    label: "Bookings",
    path: "/owner/bookings",
    icon: CalendarDays,
  },
  {
    label: "Reviews",
    path: "/owner/reviews",
    icon: Star,
  },
  {
    label: "Earnings",
    path: "/owner/earnings",
    icon: IndianRupee,
  },
];

const accountItems = [
  {
    label: "Profile",
    path: "/owner/profile",
    icon: User,
  },
  {
    label: "Notifications",
    path: "/owner/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/owner/settings",
    icon: Settings,
  },
];

// =========================================================
// SIDEBAR
// =========================================================

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  setMobileOpen,
}) => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  };

  // =======================================================
  // CLOSE MOBILE SIDEBAR
  // =======================================================

  const closeMobileSidebar = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  // =======================================================
  // NAV LINK
  // =======================================================

  const renderNavItem = (item: (typeof menuItems)[number]) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={closeMobileSidebar}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `
          group flex items-center gap-3
          rounded-xl
          transition-all duration-200
          ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}
          ${
            isActive
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }
          `
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`
                w-5 h-5 shrink-0
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-600"
                }
              `}
            />

            {!collapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  const renderAccountItem = (item: (typeof accountItems)[number]) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={closeMobileSidebar}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `
          group flex items-center gap-3
          rounded-xl
          transition-all duration-200
          ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}
          ${
            isActive
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }
          `
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`
                w-5 h-5 shrink-0
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-600"
                }
              `}
            />

            {!collapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  // =======================================================
  // DESKTOP SIDEBAR
  // =======================================================

  const sidebarContent = (
    <div
      className={`
        h-full
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* ===================================================
          LOGO
      ==================================================== */}

      <div
        className={`
          h-20
          flex
          items-center
          border-b
          border-gray-200
          ${collapsed ? "justify-center px-3" : "justify-between px-5"}
        `}
      >
        <button
          type="button"
          onClick={() => navigate("/owner/dashboard")}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6 text-white" />
          </div>

          {!collapsed && (
            <div className="text-left">
              <h1 className="font-bold text-gray-900">DriveRent</h1>

              <p className="text-xs text-gray-500">Owner Panel</p>
            </div>
          )}
        </button>

        {/* Mobile close */}

        {setMobileOpen && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* ===================================================
          NAVIGATION
      ==================================================== */}

      <div className="flex-1 overflow-y-auto px-3 py-5">
        {/* Main */}

        {!collapsed && (
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>
        )}

        <nav className="space-y-1">{menuItems.map(renderNavItem)}</nav>

        {/* Divider */}

        <div className="my-6 border-t border-gray-100" />

        {/* Account */}

        {!collapsed && (
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Account
          </p>
        )}

        <nav className="space-y-1">{accountItems.map(renderAccountItem)}</nav>
      </div>

      {/* ===================================================
          BOTTOM
      ==================================================== */}

      <div className="p-3 border-t border-gray-200">
        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-red-600
            hover:bg-red-50
            transition
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut className="w-5 h-5 shrink-0" />

          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>

        {/* Collapse Button */}

        <button
          type="button"
          onClick={() => setCollapsed((previous) => !previous)}
          className="
            hidden
            lg:flex
            w-full
            items-center
            justify-center
            gap-2
            mt-2
            py-2
            text-gray-400
            hover:text-gray-700
            hover:bg-gray-50
            rounded-lg
            transition
          "
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // =========================================================
  // MOBILE
  // =========================================================

  if (setMobileOpen) {
    return (
      <>
        {/* Mobile overlay */}

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile sidebar */}

        <aside
          className={`
            fixed
            inset-y-0
            left-0
            z-50
            lg:hidden
            transform
            transition-transform
            duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // =========================================================
  // DESKTOP
  // =========================================================

  return (
    <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
