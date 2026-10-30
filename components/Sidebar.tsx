"use client";

import { useState, useEffect, useMemo } from "react";
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
  Search,
  BarChart3,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Sparkles,
} from "lucide-react";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles?: UserRole[];
};

type NavGroup = {
  id: string;
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // State
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Load sidebar preference from localStorage
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem("sidebar_collapsed");
      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === "true");
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_collapsed", String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        id: "portals",
        title: "Portals & Analytics",
        icon: LayoutDashboard,
        items: [
          { href: "/", label: "Main Dashboard", icon: LayoutDashboard, roles: ["admin"] },
          { href: "/analytics", label: "Executive Analytics", icon: BarChart3, badge: "BI", roles: ["admin", "staff"] },
          { href: "/student-portal", label: "Student Portal", icon: GraduationCap, roles: ["student"] },
          { href: "/parent-portal", label: "Parent Portal", icon: Users, roles: ["parent"] },
          { href: "/instructor-portal", label: "Instructor Portal", icon: Plane, roles: ["faculty"] },
          { href: "/staff", label: "Staff Overview", icon: Briefcase, roles: ["staff"] },
        ],
      },
      {
        id: "academics",
        title: "Academics & Flight Ops",
        icon: Plane,
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
        id: "operations",
        title: "Fleet & Operations",
        icon: Compass,
        items: [
          { href: "/assets", label: "Fleet & Compliance", icon: Compass, badge: "DGCA", roles: ["admin", "staff", "faculty"] },
          { href: "/faculty", label: "Faculty Directory", icon: UserCheck, roles: ["admin"] },
          { href: "/hr-payroll", label: "HR & Payroll", icon: Briefcase, roles: ["admin"] },
          { href: "/visitor-gate", label: "Visitor & Gate Pass", icon: KeyRound, roles: ["admin", "staff"] },
        ],
      },
      {
        id: "finance",
        title: "Finance & Accounts",
        icon: CreditCard,
        items: [
          { href: "/fees", label: "Fee Management", icon: CreditCard, roles: ["admin", "staff", "student"] },
          { href: "/finance", label: "Finance & Ledger", icon: TrendingUp, roles: ["admin"] },
        ],
      },
      {
        id: "elearning",
        title: "E-Learning & Quality",
        icon: MonitorPlay,
        items: [
          { href: "/lms", label: "E-Learning / LMS", icon: MonitorPlay, roles: ["admin", "faculty", "student"] },
          { href: "/evaluations", label: "Instructor Ratings", icon: Star, roles: ["admin", "faculty", "student"] },
        ],
      },
      {
        id: "services",
        title: "Campus Services",
        icon: Building2,
        items: [
          { href: "/id-cards", label: "ID Card Generator", icon: IdCard, roles: ["admin", "staff", "student", "faculty"] },
          { href: "/library", label: "Aviation Library", icon: Library, roles: ["admin", "student", "faculty"] },
          { href: "/hostel", label: "Hostel Management", icon: Building2, roles: ["admin", "staff", "student"] },
          { href: "/feedback", label: "Feedback & Tickets", icon: MessageSquare, roles: ["admin", "student", "parent", "faculty", "staff"] },
          { href: "/e-signature", label: "Document E-Sign", icon: FileSignature, roles: ["admin", "student", "parent", "staff"] },
          { href: "/alumni", label: "Alumni & Placement", icon: Award, roles: ["admin", "faculty", "student"] },
        ],
      },
      {
        id: "admin",
        title: "Administration",
        icon: Settings,
        items: [
          { href: "/notifications", label: "Campus Broadcasts", icon: Megaphone, badge: "Live", roles: ["admin", "faculty", "staff", "student", "parent"] },
          { href: "/roles-permissions", label: "Roles & Permissions", icon: ShieldCheck, roles: ["admin"] },
          { href: "/settings", label: "Institute Settings", icon: Settings, roles: ["admin"] },
        ],
      },
    ],
    []
  );

  // Auto-expand group containing current active pathname
  useEffect(() => {
    if (!pathname) return;
    for (const group of navGroups) {
      if (group.items.some((item) => item.href === pathname)) {
        setCollapsedGroups((prev) => ({
          ...prev,
          [group.id]: false,
        }));
        break;
      }
    }
  }, [pathname, navGroups]);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Filter groups and items based on user role and search query
  const filteredGroups = useMemo(() => {
    return navGroups
      .map((group) => {
        const filteredItems = group.items.filter((item) => {
          const matchesRole = !item.roles || (user && item.roles.includes(user.role));
          const matchesSearch =
            !searchQuery ||
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.title.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesRole && matchesSearch;
        });

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [navGroups, user, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-40 flex flex-col h-screen select-none shrink-0 bg-slate-950 text-slate-200 border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-20" : "md:w-72"} w-72`}
      >
        {/* Top Header / Brand */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-3">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
                <Plane className="w-5 h-5 text-white transform -rotate-45" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold tracking-tight text-white uppercase truncate">
                    IRIK Aviation
                  </h2>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-500/30">
                    ERP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">DGCA Academy</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md ring-1 ring-white/20">
                <Plane className="w-4 h-4 text-white transform -rotate-45" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Collapse / Expand Toggle Button (Desktop) */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-300" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Mobile Close Button */}
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar (Only when expanded) */}
      {!isCollapsed && (
        <div className="px-3.5 pt-3 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-900/90 border border-slate-800/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Group Items */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-4 sidebar-scrollbar">
        {filteredGroups.map((group) => {
          const isGroupCollapsed = !searchQuery && !!collapsedGroups[group.id];
          const hasActiveChild = group.items.some((item) => item.href === pathname);

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Accordion Header (Only in expanded mode) */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition group ${
                    hasActiveChild ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="truncate">{group.title}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-900 px-1.5 py-0.2 rounded">
                      {group.items.length}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        isGroupCollapsed ? "-rotate-90" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>
              ) : (
                <div className="w-full border-t border-slate-800/60 my-2"></div>
              )}

              {/* Items List */}
              {(!isGroupCollapsed || isCollapsed) && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href} className="relative group/item">
                        <Link
                          href={item.href}
                          onClick={onMobileClose}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                          } rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30 ring-1 ring-white/10"
                              : "text-slate-400 hover:text-white hover:bg-slate-900/90"
                          }`}
                        >
                          <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? "text-white" : "text-slate-400 group-hover/item:text-blue-400"
                              }`}
                            />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>

                          {!isCollapsed && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isActive
                                      ? "bg-blue-700/80 text-white"
                                      : "bg-slate-800 text-blue-300 border border-blue-500/20"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                              )}
                            </div>
                          )}
                        </Link>

                        {/* Hover Tooltip when Sidebar is Collapsed */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 group-hover/item:pointer-events-auto transition-opacity z-50 flex items-center gap-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1 rounded">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile / Logout Card */}
      {user && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/10 shrink-0">
                    {user.fullName ? user.fullName.charAt(0) : "U"}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] font-semibold text-blue-400 truncate capitalize">
                    {user.role} Account
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Sign out of ERP"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/10"
                title={`${user.fullName} (${user.role})`}
              >
                {user.fullName ? user.fullName.charAt(0) : "U"}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
    </>
  );
}
