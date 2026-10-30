"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Plane,
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  UserPlus,
  BookOpen,
  Menu,
  X,
  Search,
  LogOut,
  Sliders,
  FileText,
  MonitorPlay,
  Star,
  TrendingUp,
  UserCheck,
  Compass,
  KeyRound,
  IdCard,
  MessageSquare,
  FileSignature,
  Award,
  Library,
  Building2,
  ShieldCheck,
  Settings,
  ChevronRight,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Primary 4 tabs based on role
  const getRolePrimaryTabs = () => {
    switch (user.role) {
      case "student":
        return [
          { href: "/student-portal", label: "Cadet Desk", icon: GraduationCap },
          { href: "/timetable", label: "Timetable", icon: Calendar },
          { href: "/attendance", label: "Attendance", icon: CheckSquare },
          { href: "/fees", label: "My Fees", icon: CreditCard },
        ];
      case "parent":
        return [
          { href: "/parent-portal", label: "Guardian", icon: Users },
          { href: "/parent-portal", label: "Pay Fees", icon: CreditCard },
          { href: "/attendance", label: "Attendance", icon: CheckSquare },
          { href: "/feedback", label: "Feedback", icon: MessageSquare },
        ];
      case "faculty":
        return [
          { href: "/instructor-portal", label: "Flight Ops", icon: Plane },
          { href: "/timetable", label: "Timetable", icon: Calendar },
          { href: "/attendance", label: "Attendance", icon: CheckSquare },
          { href: "/courses", label: "Courses", icon: BookOpen },
        ];
      case "staff":
        return [
          { href: "/staff", label: "Staff Desk", icon: Briefcase },
          { href: "/admissions", label: "Admissions", icon: UserPlus },
          { href: "/students", label: "Cadets", icon: Users },
          { href: "/visitor-gate", label: "Gate Pass", icon: KeyRound },
        ];
      case "admin":
      default:
        return [
          { href: "/", label: "Dashboard", icon: LayoutDashboard },
          { href: "/admissions", label: "Admissions", icon: UserPlus },
          { href: "/timetable", label: "Timetable", icon: Calendar },
          { href: "/fees", label: "Fees", icon: CreditCard },
        ];
    }
  };

  // All categorized modules for full drawer
  const allNavGroups = [
    {
      title: "Dedicated Portals",
      items: [
        { href: "/", label: "Main Dashboard", icon: LayoutDashboard, roles: ["admin"] },
        { href: "/student-portal", label: "Student Portal", icon: GraduationCap, roles: ["student"] },
        { href: "/parent-portal", label: "Parent Portal", icon: Users, roles: ["parent"] },
        { href: "/instructor-portal", label: "Instructor Portal", icon: Plane, roles: ["faculty"] },
        { href: "/staff", label: "Staff Overview", icon: Briefcase, roles: ["staff"] },
      ],
    },
    {
      title: "Academics & Flight Ops",
      items: [
        { href: "/admissions", label: "Admissions CRM", icon: UserPlus, roles: ["admin", "staff"] },
        { href: "/students", label: "Students Directory", icon: Users, roles: ["admin", "faculty", "staff"] },
        { href: "/timetable", label: "Timetable & Flights", icon: Calendar, roles: ["admin", "faculty", "student"] },
        { href: "/attendance", label: "Attendance Tracker", icon: CheckSquare, roles: ["admin", "faculty", "staff", "student"] },
        { href: "/courses", label: "Courses Catalog", icon: BookOpen, roles: ["admin", "faculty"] },
        { href: "/course-management", label: "Course Management", icon: Sliders, roles: ["admin"] },
        { href: "/enrollments", label: "Enrollments", icon: FileText, roles: ["admin"] },
      ],
    },
    {
      title: "E-Learning & Quality",
      items: [
        { href: "/lms", label: "E-Learning / LMS", icon: MonitorPlay, roles: ["admin", "faculty", "student"] },
        { href: "/evaluations", label: "Instructor Ratings", icon: Star, roles: ["admin", "faculty", "student"] },
      ],
    },
    {
      title: "Finance & Accounts",
      items: [
        { href: "/fees", label: "Fee Management", icon: CreditCard, roles: ["admin", "staff", "student"] },
        { href: "/finance", label: "Finance & Ledger", icon: TrendingUp, roles: ["admin"] },
      ],
    },
    {
      title: "Fleet, HR & Operations",
      items: [
        { href: "/assets", label: "Fleet & Compliance", icon: Compass, roles: ["admin", "staff", "faculty"] },
        { href: "/faculty", label: "Faculty Directory", icon: UserCheck, roles: ["admin"] },
        { href: "/hr-payroll", label: "HR & Payroll", icon: Briefcase, roles: ["admin"] },
        { href: "/visitor-gate", label: "Visitor & Gate Pass", icon: KeyRound, roles: ["admin", "staff"] },
      ],
    },
    {
      title: "Student Services",
      items: [
        { href: "/id-cards", label: "ID Card Generator", icon: IdCard, roles: ["admin", "staff", "student", "faculty"] },
        { href: "/feedback", label: "Feedback & Tickets", icon: MessageSquare, roles: ["admin", "student", "parent", "faculty", "staff"] },
        { href: "/e-signature", label: "Document E-Sign", icon: FileSignature, roles: ["admin", "student", "parent", "staff"] },
        { href: "/alumni", label: "Alumni & Placement", icon: Award, roles: ["admin", "faculty", "student"] },
        { href: "/library", label: "Aviation Library", icon: Library, roles: ["admin", "student", "faculty"] },
        { href: "/hostel", label: "Hostel Management", icon: Building2, roles: ["admin", "staff", "student"] },
      ],
    },
    {
      title: "Administration",
      items: [
        { href: "/roles-permissions", label: "Roles & Permissions", icon: ShieldCheck, roles: ["admin"] },
        { href: "/settings", label: "Institute Settings", icon: Settings, roles: ["admin"] },
      ],
    },
  ];

  const filteredGroups = allNavGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        const matchesRole = !item.roles || (user && item.roles.includes(user.role));
        const matchesSearch =
          !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);

  const primaryTabs = getRolePrimaryTabs();

  return (
    <>
      {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 shadow-2xl px-2 py-1.5 flex items-center justify-around select-none">
        {primaryTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={idx}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? "text-blue-400 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-transform ${
                  isActive ? "bg-blue-600/20 scale-110" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none truncate max-w-[62px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-500 absolute -bottom-0.5"></span>
              )}
            </Link>
          );
        })}

        {/* 5th TAB: MORE / ALL MODULES DRAWER BUTTON */}
        <button
          type="button"
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            showDrawer ? "text-blue-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="p-1.5 rounded-lg">
            <Menu className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">
            More
          </span>
        </button>
      </nav>

      {/* FULL SLIDE-UP MOBILE APPLICATION DRAWER */}
      {showDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="w-full bg-slate-900 rounded-t-3xl border-t border-slate-800 shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Drag Bar & Header */}
            <div className="p-4 border-b border-slate-800/80 space-y-3">
              <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-1"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{user.fullName}</h3>
                    <p className="text-[11px] text-slate-400 capitalize">{user.role} Portal</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-lg transition text-xs flex items-center gap-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search all ERP modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Categorized Links Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredGroups.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                    {group.title}
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowDrawer(false)}
                          className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                            isActive
                              ? "bg-blue-600 text-white font-semibold shadow-xs"
                              : "bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-lg ${
                                isActive ? "bg-white/20 text-white" : "bg-slate-700/50 text-slate-300"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
