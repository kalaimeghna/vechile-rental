import React, { useState } from "react";
import {
  Car,
  LayoutDashboard,
  MapPin,
  History,
  Wrench,
  Settings,
  ShieldCheck,
  Lock,
  Unlock,
  Snowflake,
  Lightbulb,
  BellRing,
  Road,
  Zap,
  Calendar,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Shield,
} from "lucide-react";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isLocked, setIsLocked] = useState(true);
  const [feedback, setFeedback] = useState<string>("");

  const triggerAction = (message: string, actionType?: string) => {
    setFeedback(`Executing: ${message}...`);
    setTimeout(() => {
      setFeedback(`Success: ${message}`);
      if (actionType === "lock") {
        setIsLocked(!isLocked);
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 text-blue-600 font-bold text-xl mb-10">
            <Car className="w-8 h-8" />
            <span>AutoPulse</span>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Live Tracking", icon: MapPin },
              { name: "Trip History", icon: History },
              { name: "Diagnostics", icon: Wrench },
              { name: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-xs text-slate-400">
          <p>System Version 2.4.1</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Vehicle Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Welcome back, Alex. Here is your vehicle's health overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Profile"
              className="w-11 h-11 rounded-full object-cover border-2 border-blue-600"
            />
            <div>
              <h4 className="text-sm font-semibold">Alex Morgan</h4>
              <span className="text-xs text-slate-400">Premium Member</span>
            </div>
          </div>
        </header>

        {/* Active Vehicle Selector Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shadow-sm">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Tesla Model 3 Long Range
            </h3>
            <span className="text-xs text-slate-500">
              License Plate:{" "}
              <strong className="text-slate-700">XYZ-8921</strong> • Status:{" "}
              <span className="text-emerald-600 font-medium">
                Parked & Secure
              </span>
            </span>
          </div>
          <button className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            Switch Vehicle
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-500 text-sm font-semibold">
              <span>Odometer</span>
              <Road className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 my-2">
              24,580 mi
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              +120 mi this week
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-500 text-sm font-semibold">
              <span>Battery / Fuel Level</span>
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 my-2">78%</div>
            <div className="text-xs text-emerald-600 font-medium">
              Est. range: 260 mi
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-500 text-sm font-semibold">
              <span>Next Maintenance</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 my-2">
              3,420 mi
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Due in ~2 months
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-500 text-sm font-semibold">
              <span>Tire Pressure</span>
              <Gauge className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 my-2">34 PSI</div>
            <div className="text-xs text-emerald-600 font-medium">
              All tires optimal
            </div>
          </div>
        </div>

        {/* Lower Grid: Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-base">Remote Controls</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Lock Action Toggle */}
              <button
                onClick={() =>
                  triggerAction(
                    isLocked ? "Doors Unlocked" : "Doors Locked Securely",
                    "lock",
                  )
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                  !isLocked
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-200"
                }`}
              >
                {isLocked ? (
                  <Lock className="w-6 h-6 text-blue-600" />
                ) : (
                  <Unlock className="w-6 h-6 text-white" />
                )}
                <span className="text-xs font-medium">
                  {isLocked ? "Unlock Doors" : "Lock Doors"}
                </span>
              </button>

              {/* Climate Control */}
              <button
                onClick={() =>
                  triggerAction("Climate Control Activated (21°C)")
                }
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 flex flex-col items-center gap-2 transition"
              >
                <Snowflake className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium text-slate-700">
                  AC Control
                </span>
              </button>

              {/* Flash Lights */}
              <button
                onClick={() =>
                  triggerAction("Headlights flashed for 5 seconds")
                }
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 flex flex-col items-center gap-2 transition"
              >
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium text-slate-700">
                  Flash Lights
                </span>
              </button>

              {/* Sound Horn */}
              <button
                onClick={() => triggerAction("Horn command sent successfully")}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 flex flex-col items-center gap-2 transition"
              >
                <BellRing className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium text-slate-700">
                  Sound Horn
                </span>
              </button>
            </div>

            {feedback && (
              <div className="mt-4 text-xs font-semibold text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
                {feedback}
              </div>
            )}
          </div>

          {/* System Status & Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="font-semibold text-base mb-6">
              System Status & Alerts
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Software Update Ready
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    v2026.4 available for download
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Wiper Fluid Low
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Refill recommended soon
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Sentry Mode Active
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    No incidents reported today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
