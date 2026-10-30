"use client";

import { useState, useMemo } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Admission } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Clock,
  Search,
  Filter,
  Download,
  Send,
  Plus,
  Edit3,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Plane,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Phone,
  Mail,
  Calendar,
  Award,
  Check,
  X,
  ChevronRight,
  Sparkles,
  MessageSquare,
  BadgeCheck,
  Lock,
} from "lucide-react";

const AVIATION_COURSES = [
  "Commercial Pilot License (CPL Ground & Flight)",
  "BBA Aviation",
  "Cabin Crew & In-flight Services",
  "BSc Aeronautical Science",
  "Airport Ground Handling Certificate",
];

const COUNSELORS = [
  "Capt. Vikram Malhotra",
  "Dr. Amit Patel",
  "Ms. Kavya Shah",
  "Dr. Neha Sharma",
  "Prof. Rajesh Kumar",
];

export default function AdmissionsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canManage = isAdmin || isStaff;

  const [activeTab, setActiveTab] = useState<"roster" | "new_application" | "dgca_auditor" | "outreach">("roster");
  const [admissions, setAdmissions] = useState<Admission[]>(store.getAdmissions());
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  // Modals & Details
  const [selectedCandidate, setSelectedCandidate] = useState<Admission | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Admission | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Admission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Application Form State
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    gender: "Male" as "Male" | "Female" | "Other",
    dob: "2006-05-15",
    appliedCourse: AVIATION_COURSES[0],
    marks: 85,
    twelfthPhysicsMaths: true,
    medicalFitnessStatus: "Class 2 Cleared" as "Class 1 Cleared" | "Class 2 Cleared" | "Pending" | "Failed" | "Not Applicable",
    counselor: COUNSELORS[0],
    notes: "",
    marksheet10th: true,
    marksheet12th: true,
    medicalCertificate: false,
    passportOrAadhaar: true,
  });

  // Fast DGCA Auditor Interactive State
  const [auditForm, setAuditForm] = useState({
    course: "Commercial Pilot License (CPL Ground & Flight)",
    age: 18,
    hasPhysicsMaths: true,
    medicalStatus: "Class 1 Cleared",
    twelfthScore: 82,
  });

  // Filtered Admissions
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const matchesSearch =
        !searchQuery ||
        adm.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.phone.includes(searchQuery) ||
        adm.appliedCourse.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || adm.status === statusFilter;
      const matchesCourse = courseFilter === "all" || adm.appliedCourse === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [admissions, searchQuery, statusFilter, courseFilter]);

  // Funnel Counts
  const totalCount = admissions.length;
  const approvedCount = admissions.filter((a) => a.status === "approved").length;
  const pendingCount = admissions.filter((a) => a.status === "pending" || a.status === "under_review").length;
  const medicalVerifiedCount = admissions.filter((a) => a.status === "medical_verified").length;
  const rejectedCount = admissions.filter((a) => a.status === "rejected").length;

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit New Application (Admin & Staff)
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    const created = store.addAdmission({
      applicantName: formData.applicantName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      dob: formData.dob,
      appliedCourse: formData.appliedCourse,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      marks: formData.marks,
      twelfthPhysicsMaths: formData.twelfthPhysicsMaths,
      medicalFitnessStatus: formData.medicalFitnessStatus,
      counselor: formData.counselor,
      notes: formData.notes,
      documentsSubmitted: {
        marksheet10th: formData.marksheet10th,
        marksheet12th: formData.marksheet12th,
        medicalCertificate: formData.medicalCertificate,
        passportOrAadhaar: formData.passportOrAadhaar,
      },
    });

    setAdmissions(store.getAdmissions());
    setActiveTab("roster");
    showToast(`Application successfully registered for ${created.applicantName}`);

    // Reset form
    setFormData({
      applicantName: "",
      email: "",
      phone: "",
      gender: "Male",
      dob: "2006-05-15",
      appliedCourse: AVIATION_COURSES[0],
      marks: 85,
      twelfthPhysicsMaths: true,
      medicalFitnessStatus: "Class 2 Cleared",
      counselor: COUNSELORS[0],
      notes: "",
      marksheet10th: true,
      marksheet12th: true,
      medicalCertificate: false,
      passportOrAadhaar: true,
    });
  };

  // Status Change (Admin Only)
  const handleUpdateStatus = (
    id: string,
    status: "pending" | "approved" | "rejected" | "under_review" | "medical_verified"
  ) => {
    if (!isAdmin) return;
    const updated = store.updateAdmissionStatus(id, status);
    if (updated) {
      setAdmissions(store.getAdmissions());
      showToast(`Status updated to ${status.replace("_", " ").toUpperCase()}`);
    }
  };

  // Quick Approve and Enroll Student (Admin Only)
  const handleApproveAndEnroll = (id: string) => {
    if (!isAdmin) return;
    const result = store.approveAndEnrollCandidate(id);
    if (result) {
      setAdmissions(store.getAdmissions());
      setSelectedCandidate(null);
      showToast(`Enrolled ${result.student.name} as Student (${result.student.rollNo})`);
    }
  };

  // Save Edit Candidate (Admin Only)
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingCandidate) return;
    store.updateAdmission(editingCandidate.id, editingCandidate);
    setAdmissions(store.getAdmissions());
    setEditingCandidate(null);
    setSelectedCandidate(null);
    showToast("Candidate application details updated");
  };

  // Delete Candidate (Admin Only)
  const handleDeleteCandidate = () => {
    if (!isAdmin || !deleteCandidate) return;
    store.deleteAdmission(deleteCandidate.id);
    setAdmissions(store.getAdmissions());
    setDeleteCandidate(null);
    setSelectedCandidate(null);
    showToast("Application removed from admissions records");
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Applicant Name,Email,Phone,Applied Course,Date,Marks,10+2 Physics & Maths,Medical Status,Status,Counselor\n";
    const rows = filteredAdmissions
      .map((a) => {
        return `"${a.applicantName}","${a.email}","${a.phone}","${a.appliedCourse}","${a.appliedDate}","${a.marks || "N/A"}%","${a.twelfthPhysicsMaths ? "Yes" : "No"}","${a.medicalFitnessStatus || "Pending"}","${a.status}","${a.counselor || "Unassigned"}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `IRIK_Admissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send WhatsApp/SMS counseling alert
  const handleSendCounselingAlert = (candidate: Admission) => {
    store.addAuditLog({
      user: user?.username || "staff",
      action: "NOTIFY",
      module: "Admissions",
      details: `Dispatched DGCA admission counseling invitation SMS to ${candidate.applicantName} (${candidate.phone})`,
    });
    showToast(`Counseling invite & document checklist sent to ${candidate.phone}`);
  };

  // Status Badge Helper
  const getStatusBadge = (status: Admission["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved & Enrolled
          </span>
        );
      case "medical_verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Medical Verified
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Eye className="w-3 h-3 text-purple-600" />
            Under Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  // Medical Badge Helper
  const getMedicalBadge = (medStatus?: string) => {
    if (medStatus === "Class 1 Cleared") {
      return (
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Class 1 Cleared
        </span>
      );
    }
    if (medStatus === "Class 2 Cleared") {
      return (
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Class 2 Cleared
        </span>
      );
    }
    if (medStatus === "Failed") {
      return (
        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          Medically Unfit
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
        {medStatus || "Pending"}
      </span>
    );
  };

  // DGCA Auditor Calculation
  const auditResult = useMemo(() => {
    const isPilot = auditForm.course.includes("Pilot") || auditForm.course.includes("CPL");
    const isCabinCrew = auditForm.course.includes("Cabin Crew");

    if (isPilot) {
      if (auditForm.age < 17) {
        return { eligible: false, message: "DGCA Requirement: Minimum age for Student Pilot License (SPL) is 17 years." };
      }
      if (!auditForm.hasPhysicsMaths) {
        return { eligible: false, message: "DGCA Ineligible: 10+2 with Physics & Mathematics is mandatory for Commercial Pilot License." };
      }
      if (auditForm.medicalStatus === "Failed" || auditForm.medicalStatus === "Not Applicable") {
        return { eligible: false, message: "DGCA Class 1 or Class 2 Medical fitness certificate is required." };
      }
      return { eligible: true, message: "Candidate meets all DGCA Civil Aviation Requirements (CAR Section 7) for Pilot Training." };
    }

    if (isCabinCrew) {
      if (auditForm.age < 18) {
        return { eligible: false, message: "Aviation Rule: Minimum age for Cabin Crew ground & flight line training is 18 years." };
      }
      if (auditForm.twelfthScore < 50) {
        return { eligible: false, message: "Minimum 50% in 10+2 required for Cabin Crew airline placement eligibility." };
      }
      return { eligible: true, message: "Candidate is fully eligible for Cabin Crew & In-flight Services program." };
    }

    if (auditForm.twelfthScore < 50) {
      return { eligible: false, message: "Minimum 50% in qualifying examination required for academic admission." };
    }
    return { eligible: true, message: "Candidate meets University & DGCA academic admission standards." };
  }, [auditForm]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Top Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  DGCA Cadre Admissions & CRM
                </span>
                {canManage ? (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admissions Officer Access
                  </span>
                ) : (
                  <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-600/40 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Read Only Access
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Admissions & Enrollment Hub
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Comprehensive applicant intake, DGCA 10+2 eligibility screening, Class 1/2 medical verification, and direct roll number enrollment.
              </p>
            </div>

            {/* Navigation Tab Bar */}
            <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
              <button
                onClick={() => setActiveTab("roster")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "roster"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Applications ({totalCount})</span>
              </button>
              {canManage && (
                <button
                  onClick={() => setActiveTab("new_application")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "new_application"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Registration</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab("dgca_auditor")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "dgca_auditor"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DGCA Eligibility Auditor</span>
              </button>
              <button
                onClick={() => setActiveTab("outreach")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "outreach"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Counseling CRM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Funnel Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setStatusFilter("all")}
            className={`bg-white p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "all" ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all 5 aviation cadres</p>
          </div>

          <div
            onClick={() => setStatusFilter("pending")}
            className={`bg-white p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "pending" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Review</p>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-700 mt-2">{pendingCount}</p>
            <p className="text-[11px] text-amber-600/80 mt-0.5">Awaiting counselor decision</p>
          </div>

          <div
            onClick={() => setStatusFilter("medical_verified")}
            className={`bg-white p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "medical_verified" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Medical Cleared</p>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-indigo-700 mt-2">{medicalVerifiedCount}</p>
            <p className="text-[11px] text-indigo-600/80 mt-0.5">DGCA Class 1/2 Certified</p>
          </div>

          <div
            onClick={() => setStatusFilter("approved")}
            className={`bg-white p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "approved" ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Enrolled Cadets</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{approvedCount}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Roll number allocated</p>
          </div>
        </div>

        {/* TAB 1: ALL APPLICATIONS & CANDIDATE DOSSIER */}
        {activeTab === "roster" && (
          <div className="space-y-4">
            {/* Unified Control Toolbar */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search & Program Filter */}
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search applicant name, email, phone, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>

                <div className="min-w-[210px]">
                  <SearchableSelect
                    value={courseFilter}
                    onChange={(val) => setCourseFilter(val)}
                    options={[
                      { value: "all", label: "All Aviation Courses" },
                      ...AVIATION_COURSES.map((c) => ({ value: c, label: c })),
                    ]}
                    size="sm"
                  />
                </div>

                <div className="min-w-[160px]">
                  <SearchableSelect
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val)}
                    options={[
                      { value: "all", label: "All Statuses" },
                      { value: "pending", label: "Pending Review" },
                      { value: "under_review", label: "Under Review" },
                      { value: "medical_verified", label: "Medical Verified" },
                      { value: "approved", label: "Approved & Enrolled" },
                      { value: "rejected", label: "Rejected" },
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              {/* Actions (New Application ONLY for Admin) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab("new_application")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Application</span>
                  </button>
                )}
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-5 py-3.5">Candidate Details</th>
                      <th className="px-4 py-3.5">Aviation Course</th>
                      <th className="px-4 py-3.5">Merit Score</th>
                      <th className="px-4 py-3.5">DGCA Medical</th>
                      <th className="px-4 py-3.5">10+2 Phy/Math</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {filteredAdmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400 text-xs italic">
                          No admission applications found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAdmissions.map((adm) => (
                        <tr
                          key={adm.id}
                          className="hover:bg-slate-50/80 transition cursor-pointer"
                          onClick={() => setSelectedCandidate(adm)}
                        >
                          {/* Candidate Details */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {adm.applicantName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{adm.applicantName}</p>
                                <p className="text-[11px] text-slate-500">{adm.email} • {adm.phone}</p>
                              </div>
                            </div>
                          </td>

                          {/* Applied Course */}
                          <td className="px-4 py-3.5">
                            <span className="font-medium text-slate-900 block truncate max-w-[200px]" title={adm.appliedCourse}>
                              {adm.appliedCourse}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Applied on {adm.appliedDate}
                            </span>
                          </td>

                          {/* Entrance/Merit Marks */}
                          <td className="px-4 py-3.5">
                            {adm.marks ? (
                              <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                {adm.marks}%
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">N/A</span>
                            )}
                          </td>

                          {/* Medical Fitness */}
                          <td className="px-4 py-3.5">
                            {getMedicalBadge(adm.medicalFitnessStatus)}
                          </td>

                          {/* 10+2 Physics & Maths */}
                          <td className="px-4 py-3.5">
                            {adm.twelfthPhysicsMaths ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Eligible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                Non-PCM
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            {getStatusBadge(adm.status)}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedCandidate(adm)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="View dossier & documents"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => setEditingCandidate(adm)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                title="Edit application"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {isAdmin && adm.status !== "approved" && (
                              <button
                                onClick={() => handleApproveAndEnroll(adm.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition shadow-2xs"
                                title="Approve and generate Roll Number"
                              >
                                Enroll
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEW ADMISSION APPLICATION FORM (Admin Only) */}
        {isAdmin && activeTab === "new_application" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Aviation Candidate Application</h3>
                <p className="text-xs text-slate-500">
                  Register applicant details, verify 10+2 marks, select aviation program, and record DGCA medical status.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("roster")}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Back to Applications
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-5">
              {/* Section 1: Candidate Personal Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  1. Candidate Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ankit Sharma"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ankit@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Gender"
                      value={formData.gender}
                      onChange={(val) => setFormData({ ...formData, gender: val as any })}
                      options={["Male", "Female", "Other"]}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Program & Academic Eligibility */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  2. Program & Academic Eligibility
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <SearchableSelect
                      label="Aviation Program / Cadre *"
                      value={formData.appliedCourse}
                      onChange={(val) => setFormData({ ...formData, appliedCourse: val })}
                      options={AVIATION_COURSES}
                      size="sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Qualifying 10+2 / Entrance Marks (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">10+2 with Physics & Mathematics</p>
                    <p className="text-[11px] text-slate-500">Mandatory for Commercial Pilot License (CPL) & BSc Aviation</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.twelfthPhysicsMaths}
                    onChange={(e) => setFormData({ ...formData, twelfthPhysicsMaths: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Section 3: DGCA Medical & Documentation Status */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  3. DGCA Medical Fitness & Document Verification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <SearchableSelect
                      label="DGCA Medical Certificate Status"
                      value={formData.medicalFitnessStatus}
                      onChange={(val) => setFormData({ ...formData, medicalFitnessStatus: val as any })}
                      options={[
                        { value: "Class 1 Cleared", label: "Class 1 Cleared (IAM / AFCME)" },
                        { value: "Class 2 Cleared", label: "Class 2 Cleared (DGCA Empanelled Doctor)" },
                        { value: "Pending", label: "Medical Appointment Pending" },
                        { value: "Failed", label: "Failed / Medically Unfit" },
                        { value: "Not Applicable", label: "Not Applicable (Ground Studies)" }
                      ]}
                      size="sm"
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Assigned Admissions Counselor"
                      value={formData.counselor}
                      onChange={(val) => setFormData({ ...formData, counselor: val })}
                      options={COUNSELORS}
                      size="sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Submitted Application Documents Checklist:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.marksheet10th}
                        onChange={(e) => setFormData({ ...formData, marksheet10th: e.target.checked })}
                        className="w-3.5 h-3.5 text-blue-600 rounded"
                      />
                      <span>10th Marksheet</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.marksheet12th}
                        onChange={(e) => setFormData({ ...formData, marksheet12th: e.target.checked })}
                        className="w-3.5 h-3.5 text-blue-600 rounded"
                      />
                      <span>12th Marksheet</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.medicalCertificate}
                        onChange={(e) => setFormData({ ...formData, medicalCertificate: e.target.checked })}
                        className="w-3.5 h-3.5 text-blue-600 rounded"
                      />
                      <span>Medical Certificate</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.passportOrAadhaar}
                        onChange={(e) => setFormData({ ...formData, passportOrAadhaar: e.target.checked })}
                        className="w-3.5 h-3.5 text-blue-600 rounded"
                      />
                      <span>Passport / Aadhaar</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Counselor Notes & Interview Feedback
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add interview assessment notes or pending verification remarks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit & Register Application</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("roster")}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: DGCA FLIGHT CADRE ELIGIBILITY AUDITOR */}
        {activeTab === "dgca_auditor" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Audit Input Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">DGCA Eligibility Screening Tool</h3>
                <p className="text-xs text-slate-500">
                  Verify whether an aspirant meets DGCA CAR Section 7 requirements for Pilot & Aviation Cadres.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <SearchableSelect
                    label="Intended Course"
                    value={auditForm.course}
                    onChange={(val) => setAuditForm({ ...auditForm, course: val })}
                    options={AVIATION_COURSES}
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Age (Years)</label>
                    <input
                      type="number"
                      min={15}
                      max={40}
                      value={auditForm.age}
                      onChange={(e) => setAuditForm({ ...auditForm, age: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">12th Marks (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={auditForm.twelfthScore}
                      onChange={(e) => setAuditForm({ ...auditForm, twelfthScore: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <SearchableSelect
                    label="Medical Fitness Assessment"
                    value={auditForm.medicalStatus}
                    onChange={(val) => setAuditForm({ ...auditForm, medicalStatus: val })}
                    options={["Class 1 Cleared", "Class 2 Cleared", "Pending", "Failed", "Not Applicable"]}
                    size="sm"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Passed 10+2 with Physics & Math</span>
                  <input
                    type="checkbox"
                    checked={auditForm.hasPhysicsMaths}
                    onChange={(e) => setAuditForm({ ...auditForm, hasPhysicsMaths: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Audit Decision Result Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Eligibility Verdict & Rule Checklist</h3>
                <p className="text-xs text-slate-500">Official DGCA and University compliance outcome</p>
              </div>

              <div
                className={`p-5 rounded-xl border space-y-2 ${
                  auditResult.eligible
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                    : "bg-rose-50/80 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {auditResult.eligible ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>COMPLIANT & ELIGIBLE</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>INELIGIBLE UNDER REGULATIONS</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed opacity-90">{auditResult.message}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 text-xs">Standard Aviation Criteria:</h4>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Pilot License Min Age</span>
                  <span className="font-semibold text-slate-900">17 Years</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Pilot Academic Requirement</span>
                  <span className="font-semibold text-slate-900">10+2 with Physics & Maths (or NIOS equivalent)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Pilot Medical Clearance</span>
                  <span className="font-semibold text-slate-900">DGCA Class 1 Medical for CPL Issue</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Cabin Crew Min Height</span>
                  <span className="font-semibold text-slate-900">Female: 155 cm | Male: 170 cm</span>
                </div>
              </div>

              {isAdmin && auditResult.eligible && (
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      appliedCourse: auditForm.course,
                      marks: auditForm.twelfthScore,
                      twelfthPhysicsMaths: auditForm.hasPhysicsMaths,
                      medicalFitnessStatus: auditForm.medicalStatus as any,
                    });
                    setActiveTab("new_application");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Proceed to Register Candidate</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: COUNSELING OUTREACH CRM */}
        {activeTab === "outreach" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Aviation Counseling & Lead Engagement</h3>
                <p className="text-xs text-slate-500">
                  1-Click automated counseling invitation and DGCA medical reminder dispatch.
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                {pendingCount + medicalVerifiedCount} Active Pipeline Leads
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admissions
                .filter((a) => a.status !== "approved" && a.status !== "rejected")
                .map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{candidate.applicantName}</h4>
                        <p className="text-[11px] text-slate-500">{candidate.appliedCourse}</p>
                      </div>
                      {getStatusBadge(candidate.status)}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{candidate.phone}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{candidate.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-slate-400" />
                        <span>Counselor: {candidate.counselor || "Unassigned"}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendCounselingAlert(candidate)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs transition shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Invite SMS / App</span>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleApproveAndEnroll(candidate.id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition shadow-2xs"
                        >
                          Enroll
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Candidate Dossier Inspection Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {selectedCandidate.applicantName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      Candidate Dossier
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">
                      {selectedCandidate.applicantName}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Aviation Course</span>
                  <span className="font-semibold text-slate-900">{selectedCandidate.appliedCourse}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Contact</span>
                  <span className="font-semibold text-slate-900">{selectedCandidate.email} • {selectedCandidate.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Merit / Entrance Score</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.marks ? `${selectedCandidate.marks}%` : "N/A"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">10+2 Physics & Maths</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.twelfthPhysicsMaths ? "Yes (Eligible)" : "No (Non-PCM)"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">DGCA Medical Fitness</span>
                  <span>{getMedicalBadge(selectedCandidate.medicalFitnessStatus)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Counselor Assigned</span>
                  <span className="font-semibold text-slate-900">{selectedCandidate.counselor || "Unassigned"}</span>
                </div>
                <div className="py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 block mb-1">Submitted Documents</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.documentsSubmitted?.marksheet10th && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">10th Marksheet</span>
                    )}
                    {selectedCandidate.documentsSubmitted?.marksheet12th && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">12th Marksheet</span>
                    )}
                    {selectedCandidate.documentsSubmitted?.medicalCertificate && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">Medical Fitness</span>
                    )}
                    {selectedCandidate.documentsSubmitted?.passportOrAadhaar && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">ID Proof</span>
                    )}
                  </div>
                </div>
                {selectedCandidate.notes && (
                  <div className="py-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-700 block">Counselor Remarks:</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{selectedCandidate.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons (Enroll/Edit/Delete ONLY for Admin) */}
              <div className="pt-2 flex flex-wrap gap-2">
                {isAdmin ? (
                  <>
                    {selectedCandidate.status !== "approved" && (
                      <button
                        onClick={() => handleApproveAndEnroll(selectedCandidate.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve & Enroll Cadet</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const c = selectedCandidate;
                        setSelectedCandidate(null);
                        setEditingCandidate(c);
                      }}
                      className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition border border-blue-200 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        const c = selectedCandidate;
                        setSelectedCandidate(null);
                        setDeleteCandidate(c);
                      }}
                      className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition border border-rose-200 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Close Dossier
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Candidate Modal (Admin Only) */}
        {isAdmin && editingCandidate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Application Editor
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Edit Candidate Profile</h3>
                </div>
                <button
                  onClick={() => setEditingCandidate(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    required
                    value={editingCandidate.applicantName}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, applicantName: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editingCandidate.email}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={editingCandidate.phone}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <SearchableSelect
                      label="Course"
                      value={editingCandidate.appliedCourse}
                      onChange={(val) => setEditingCandidate({ ...editingCandidate, appliedCourse: val })}
                      options={AVIATION_COURSES}
                      size="sm"
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Status"
                      value={editingCandidate.status}
                      onChange={(val) => setEditingCandidate({ ...editingCandidate, status: val as any })}
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "under_review", label: "Under Review" },
                        { value: "medical_verified", label: "Medical Verified" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" }
                      ]}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Marks (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingCandidate.marks || 0}
                      onChange={(e) => setEditingCandidate({ ...editingCandidate, marks: parseInt(e.target.value) || 0 })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Medical Fitness"
                      value={editingCandidate.medicalFitnessStatus || "Pending"}
                      onChange={(val) => setEditingCandidate({ ...editingCandidate, medicalFitnessStatus: val as any })}
                      options={["Class 1 Cleared", "Class 2 Cleared", "Pending", "Failed", "Not Applicable"]}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCandidate(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal (Admin Only) */}
        {isAdmin && deleteCandidate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Delete Application?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove the application for <strong className="text-slate-800">{deleteCandidate.applicantName}</strong>?
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleDeleteCandidate}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
