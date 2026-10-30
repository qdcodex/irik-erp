"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Plane,
  Briefcase,
  BookOpen,
  Sliders,
  FileText,
  UserPlus,
  Calendar,
  CheckSquare,
  MonitorPlay,
  Star,
  CreditCard,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Compass,
  KeyRound,
  IdCard,
  MessageSquare,
  FileSignature,
  Award,
  Library,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  Search,
} from "lucide-react";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles?: UserRole[];
};

type NavGroup = {
  title: string;
  items: MenuItem[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navGroups: NavGroup[] = [
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

  // Filter groups and items based on role and optional search query
  const filteredGroups = navGroups
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

  return (
    <aside className="hidden md:flex w-72 bg-slate-950 text-slate-200 border-r border-slate-800/80 flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
            <Plane className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight text-white uppercase truncate">
                IRIK Aviation
              </h2>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-500/30">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">DGCA Approved Academy</p>
          </div>
        </div>

        {/* Quick Nav Search Filter */}
        <div className="mt-3.5 relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Navigation Links with Category Groups */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {filteredGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info & Logout Footer */}
      {user && (
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/80 space-y-2.5">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/10 shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
