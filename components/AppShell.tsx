"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import NotificationCenter from "./NotificationCenter";
import Link from "next/link";
import { UserRole } from "@/lib/types";
import { ShieldCheck, Plane, Menu, User, ShieldAlert, Lock, ArrowLeft } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

const ROLE_DEFAULT_PAGES: Record<UserRole, string> = {
  admin: "/",
  staff: "/staff",
  faculty: "/instructor-portal",
  student: "/student-portal",
  parent: "/parent-portal",
};

const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["admin"],
  "/analytics": ["admin", "staff"],
  "/student-portal": ["student", "admin"],
  "/parent-portal": ["parent", "admin"],
  "/instructor-portal": ["faculty", "admin"],
  "/staff": ["staff", "admin"],
  "/admissions": ["admin", "staff"],
  "/students": ["admin", "faculty", "staff"],
  "/timetable": ["admin", "faculty", "student", "parent"],
  "/attendance": ["admin", "faculty", "staff", "student", "parent"],
  "/courses": ["admin", "faculty"],
  "/course-management": ["admin"],
  "/enrollments": ["admin"],
  "/assets": ["admin", "staff", "faculty"],
  "/faculty": ["admin"],
  "/hr-payroll": ["admin", "staff"],
  "/visitor-gate": ["admin", "staff"],
  "/fees": ["admin", "staff", "student", "parent"],
  "/finance": ["admin"],
  "/lms": ["admin", "faculty", "student"],
  "/evaluations": ["admin", "faculty", "student"],
  "/id-cards": ["admin", "staff", "student", "faculty"],
  "/library": ["admin", "staff", "faculty", "student"],
  "/hostel": ["admin", "staff", "student"],
  "/feedback": ["admin", "student", "parent", "faculty", "staff"],
  "/e-signature": ["admin", "student", "parent", "staff"],
  "/alumni": ["admin", "staff", "faculty", "student"],
  "/notifications": ["admin", "faculty", "staff", "student", "parent"],
  "/roles-permissions": ["admin"],
  "/settings": ["admin"],
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

    // Redirect non-admin users from root "/" to their specific portal
    if (isAuthenticated && user && pathname === "/" && user.role !== "admin") {
      const targetPortal = ROLE_DEFAULT_PAGES[user.role] || "/";
      router.replace(targetPortal);
      return;
    }

    setIsReady(true);
  }, [isLoading, isAuthenticated, user, pathname, router, isPublicPage]);

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

  // Check route-level permissions
  const allowedRoles = ROUTE_PERMISSIONS[pathname];
  const isAuthorized = !allowedRoles || (user && allowedRoles.includes(user.role));

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

        {/* Dynamic Main Body - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {isAuthorized ? (
            children
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-8 max-w-md text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Clearance Restricted
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  Access Denied
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  This flight institute module requires administrative clearance. Your account role (<strong className="capitalize text-slate-800">{user?.role}</strong>) is not authorized to access this resource.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Link
                    href={user ? ROLE_DEFAULT_PAGES[user.role] || "/" : "/login"}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to My Portal</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar (Application Style) */}
      <MobileBottomNav />
    </div>
  );
}
