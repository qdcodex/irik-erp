"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DEMO_CREDENTIALS } from "@/lib/auth-store";
import {
  Plane,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        // Smart dynamic redirection based on user role
        const stored = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
        const loggedUser = stored ? JSON.parse(stored) : null;
        const role = loggedUser?.role;

        if (role === "parent") {
          router.push("/parent-portal");
        } else if (role === "student") {
          router.push("/student-portal");
        } else if (role === "faculty") {
          router.push("/instructor-portal");
        } else if (role === "staff") {
          router.push("/staff");
        } else {
          router.push("/");
        }
      } else {
        setError("Invalid credentials. Please try demo accounts below.");
      }
    } catch (err) {
      setError("An error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentialsAndLogin = async (creds: (typeof DEMO_CREDENTIALS)[0]) => {
    setUsername(creds.username);
    setPassword(creds.password);
    setError("");
    setIsLoading(true);

    try {
      const success = await login(creds.username, creds.password);
      if (success) {
        if (creds.role === "parent") {
          router.push("/parent-portal");
        } else if (creds.role === "student") {
          router.push("/student-portal");
        } else if (creds.role === "faculty") {
          router.push("/instructor-portal");
        } else {
          router.push("/");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "faculty":
        return <Plane className="w-4 h-4 text-indigo-600" />;
      case "student":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "parent":
        return <Users className="w-4 h-4 text-purple-600" />;
      case "staff":
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      default:
        return <User className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600/20 border border-blue-400/30 text-blue-400 mb-1 shadow-inner">
            <Plane className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            IRIK International Aviation ERP
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Sign in to access your flight operations, cadet portal, or guardian desk
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-7 border border-slate-100 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Registered Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. parent or admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to ERP"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 1-Click Fast Demo Login Switcher */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 text-white space-y-3 shadow-sm backdrop-blur-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <span className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Instant Demo Login
            </span>
            <span className="text-[10px] text-slate-400">Click any role to log in</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_CREDENTIALS.map((creds, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => fillCredentialsAndLogin(creds)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between group ${
                  creds.role === "parent"
                    ? "bg-purple-950/40 border-purple-500/40 hover:bg-purple-900/50"
                    : "bg-slate-900/60 border-slate-700 hover:bg-slate-700/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {getRoleIcon(creds.role)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white capitalize">{creds.role} Role</p>
                    <p className="text-[10px] text-slate-400 font-mono">User: {creds.username}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-xs">
          <p>DGCA Approved Flight Training Organization • FTO-2026/049</p>
        </div>
      </div>
    </div>
  );
}
