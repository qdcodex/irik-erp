"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import NotificationCenter from "./NotificationCenter";
import { ShieldCheck, Plane, Menu, User } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isPublicPage = pathname === "/login" || pathname === "/unauthorized";

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isPublicPage) {
      router.push("/login");
      return;
    }

    setIsReady(true);
  }, [isLoading, isAuthenticated, router, isPublicPage]);

  // For login or public pages, render children without the sidebar shell
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Loading state before authentication check resolves
  if (!isReady || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <div className="animate-spin inline-block w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-xs text-slate-400 font-medium">Loading Aviation ERP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Persistent Desktop Sidebar & Mobile Slide-in Drawer */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 shrink-0 z-30 shadow-2xs">
          <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Mobile / Tablet Hamburger Toggle */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                title="Open navigation menu"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex md:hidden w-8 h-8 rounded-lg bg-blue-600 items-center justify-center text-white shadow-sm shrink-0">
                <Plane className="w-4 h-4 transform -rotate-45" />
              </div>

              <div>
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                  IRIK Aviation Institute
                </h1>
                <p className="text-[10px] text-slate-500 md:hidden capitalize">
                  {user?.role} Portal
                </p>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                DGCA Certified
              </span>
            </div>

            {/* Right Header: Notification Center & User Profile Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationCenter />

              {user && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white cursor-pointer"
                    title={`${user.fullName || user.username} (${user.role})`}
                  >
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize leading-tight mt-0.5">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Body - Scrollable area padded for Mobile Bottom Nav */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {children}
        </main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar (Application Style) */}
      <MobileBottomNav />
    </div>
  );
}
