"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import NotificationCenter from "./NotificationCenter";
import { ShieldCheck, Plane } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

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
      {/* Persistent Desktop Sidebar - Hidden on mobile view */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 shrink-0 z-30 shadow-2xs">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="md:hidden w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
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
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ml-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                DGCA Certified
              </span>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter />
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
