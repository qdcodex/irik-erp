"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"attendance" | "fees" | "documents" | "announcements" | "facilities">("attendance");

  // Attendance Management
  const [attendanceData, setAttendanceData] = useState(store.getAttendance());
  const [attendanceForm, setAttendanceForm] = useState({
    studentId: "",
    courseId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
  });

  // Get data from store
  const students = store.getStudents();
  const courses = store.getCourses();

  // Fee Management
  const fees = store.getFees();
  const [feeFilter, setFeeFilter] = useState<"all" | "pending" | "paid">("all");

  const filteredFees = feeFilter === "all"
    ? fees
    : fees.filter((f) => f.status === feeFilter);

  const pendingFees = fees.filter((f) => f.status === "pending");
  const paidFees = fees.filter((f) => f.status === "paid");
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = paidFees.reduce((sum, f) => sum + f.amount, 0);

  // Group fees by student
  const feesByStudent = students.map((student) => {
    const studentFees = filteredFees.filter((f) => f.studentId === student.id);
    const totalAmount = studentFees.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = studentFees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = studentFees.filter((f) => f.status === "pending").reduce((sum, f) => sum + f.amount, 0);

    return {
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      totalFees: totalAmount,
      paidAmount,
      pendingAmount,
      fees: studentFees,
      status: pendingAmount > 0 ? "pending" : "completed",
    };
  }).filter((s) => s.totalFees > 0);

  // Documents
  const [documents, setDocuments] = useState([
    { id: "1", name: "Admission Form Template", type: "PDF", uploadedBy: "Admin", date: "2024-08-01" },
    { id: "2", name: "Fee Receipt Format", type: "Excel", uploadedBy: "Admin", date: "2024-08-02" },
    { id: "3", name: "Staff Manual", type: "PDF", uploadedBy: "Admin", date: "2024-08-03" },
  ]);

  // Announcements
  const [announcements, setAnnouncements] = useState([
    { id: "1", title: "Admission Deadline Extended", content: "Registration deadline extended to September 15", date: "2024-08-20" },
    { id: "2", title: "New Holiday Schedule", content: "Check the updated holiday calendar for 2024", date: "2024-08-19" },
    { id: "3", title: "Maintenance Notice", content: "Server maintenance scheduled for Sunday", date: "2024-08-18" },
  ]);

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "" });

  // Facilities
  const [facilities] = useState([
    { id: "1", name: "Main Auditorium", capacity: 500, status: "available", floor: "Ground" },
    { id: "2", name: "Computer Lab A", capacity: 40, status: "available", floor: "1st" },
    { id: "3", name: "Seminar Hall", capacity: 100, status: "maintenance", floor: "2nd" },
    { id: "4", name: "Library Study Room", capacity: 20, status: "available", floor: "1st" },
  ]);

  const handleAttendanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttendanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAttendance = () => {
    if (attendanceForm.studentId && attendanceForm.courseId) {
      const newAttendance = {
        id: Date.now().toString(),
        studentId: attendanceForm.studentId,
        courseId: attendanceForm.courseId,
        date: attendanceForm.date,
        status: (attendanceForm.status === "leave" ? "late" : attendanceForm.status) as "present" | "absent" | "late",
        semester: 1,
      };
      setAttendanceData([...attendanceData, newAttendance]);
      setAttendanceForm({
        studentId: "",
        courseId: "",
        date: new Date().toISOString().split("T")[0],
        status: "present",
      });
    }
  };

  const handleAddAnnouncement = () => {
    if (announcementForm.title && announcementForm.content) {
      setAnnouncements([
        {
          id: Date.now().toString(),
          title: announcementForm.title,
          content: announcementForm.content,
          date: new Date().toISOString().split("T")[0],
        },
        ...announcements,
      ]);
      setAnnouncementForm({ title: "", content: "" });
      setShowAnnouncementForm(false);
    }
  };

  if (user?.role !== "staff") {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Access Denied. This page is for staff only.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">👨‍💼 Staff Dashboard</h1>
          <p className="text-blue-100">Welcome, {user.fullName}! Manage college operations efficiently.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-600 font-medium">Pending Fees</p>
            <p className="text-2xl font-bold text-orange-700">₹{(totalPending / 100000).toFixed(1)}L</p>
            <p className="text-xs text-orange-500 mt-1">{pendingFees.length} students</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Total Students</p>
            <p className="text-2xl font-bold text-purple-700">{students.length}</p>
            <p className="text-xs text-purple-500 mt-1">Active enrollments</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Available Facilities</p>
            <p className="text-2xl font-bold text-green-700">{facilities.filter((f) => f.status === "available").length}</p>
            <p className="text-xs text-green-500 mt-1">Ready to use</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Announcements</p>
            <p className="text-2xl font-bold text-blue-700">{announcements.length}</p>
            <p className="text-xs text-blue-500 mt-1">Recent updates</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: "attendance", label: "📋 Attendance", icon: "📋" },
              { id: "fees", label: "💰 Fee Management", icon: "💰" },
              { id: "announcements", label: "📢 Announcements", icon: "📢" },
              { id: "facilities", label: "🏢 Facilities", icon: "🏢" },
              { id: "documents", label: "📁 Documents", icon: "📁" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Mark Attendance</h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <SearchableSelect
                        label="Student *"
                        value={attendanceForm.studentId}
                        onChange={(value) => setAttendanceForm((prev) => ({ ...prev, studentId: value }))}
                        options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))}
                        placeholder="Select Student"
                      />
                    </div>

                    <div>
                      <SearchableSelect
                        label="Course *"
                        value={attendanceForm.courseId}
                        onChange={(value) => setAttendanceForm((prev) => ({ ...prev, courseId: value }))}
                        options={courses.map((c) => ({ value: c.id, label: c.name }))}
                        placeholder="Select Course"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={attendanceForm.date}
                        onChange={handleAttendanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <SearchableSelect
                        label="Status *"
                        value={attendanceForm.status}
                        onChange={(value) => setAttendanceForm((prev) => ({ ...prev, status: value }))}
                        options={[
                          { value: "present", label: "Present ✓" },
                          { value: "absent", label: "Absent ✗" },
                          { value: "leave", label: "Leave 📝" },
                        ]}
                        placeholder="Select Status"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddAttendance}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + Mark Attendance
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Course</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.slice(0, 10).map((att) => (
                        <tr key={att.id} className="border-t">
                          <td className="px-4 py-2">{students.find((s) => s.id === att.studentId)?.name}</td>
                          <td className="px-4 py-2">{courses.find((c) => c.id === att.courseId)?.name}</td>
                          <td className="px-4 py-2">{att.date}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              att.status === "present" ? "bg-green-100 text-green-800" :
                              att.status === "absent" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fees Tab */}
            {activeTab === "fees" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">📊 Fee Management & Analytics</h3>

                {/* Fee Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Total Expected</p>
                    <p className="text-2xl font-bold text-blue-700">₹{((totalCollected + totalPending) / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-blue-500 mt-1">{fees.length} fee records</p>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Amount Collected</p>
                    <p className="text-2xl font-bold text-green-700">₹{(totalCollected / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-green-500 mt-1">{paidFees.length} payments received</p>
                  </div>

                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-600 font-medium">Pending Amount</p>
                    <p className="text-2xl font-bold text-orange-700">₹{(totalPending / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-orange-500 mt-1">{pendingFees.length} outstanding</p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Collection Rate</p>
                    <p className="text-2xl font-bold text-purple-700">{((totalCollected / (totalCollected + totalPending)) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-purple-500 mt-1">On track with goals</p>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="bg-gray-50 rounded-lg p-4 flex gap-3 flex-wrap">
                  <button
                    onClick={() => setFeeFilter("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      feeFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Fees
                  </button>
                  <button
                    onClick={() => setFeeFilter("pending")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      feeFilter === "pending"
                        ? "bg-orange-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Pending ({pendingFees.length})
                  </button>
                  <button
                    onClick={() => setFeeFilter("paid")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      feeFilter === "paid"
                        ? "bg-green-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Paid ({paidFees.length})
                  </button>
                </div>

                {/* Student-wise Fee Summary */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Student Fee Status</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Student Name</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Roll No</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Total Due</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Paid</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Pending</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feesByStudent.map((feeData, idx) => {
                          const progressPercent = (feeData.paidAmount / feeData.totalFees) * 100;
                          return (
                            <tr key={feeData.studentId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 font-medium text-gray-900">{feeData.studentName}</td>
                              <td className="px-4 py-3 text-gray-600">{feeData.rollNo}</td>
                              <td className="px-4 py-3 text-right text-gray-900 font-medium">₹{feeData.totalFees.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right text-green-700 font-medium">₹{feeData.paidAmount.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right text-orange-700 font-medium">₹{feeData.pendingAmount.toLocaleString()}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  feeData.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}>
                                  {feeData.status === "completed" ? "✓ Paid" : "⏳ Pending"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      progressPercent === 100 ? "bg-green-600" : "bg-orange-500"
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{progressPercent.toFixed(0)}%</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detailed Fee Breakdown */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Fee Details by Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from(new Set(filteredFees.map((f) => f.feeType))).map((feeType) => {
                      const typeFees = filteredFees.filter((f) => f.feeType === feeType);
                      const typeTotal = typeFees.reduce((sum, f) => sum + f.amount, 0);
                      const typePaid = typeFees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);

                      return (
                        <div key={feeType} className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-600">{feeType}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">₹{typeTotal.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Collected: <span className="text-green-600 font-bold">₹{typePaid.toLocaleString()}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Records: <span className="font-bold">{typeFees.length}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* All Transactions */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">All Fee Transactions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold">Student</th>
                          <th className="px-4 py-3 text-left font-bold">Fee Type</th>
                          <th className="px-4 py-3 text-right font-bold">Amount</th>
                          <th className="px-4 py-3 text-left font-bold">Due Date</th>
                          <th className="px-4 py-3 text-center font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFees.map((fee) => (
                          <tr key={fee.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{students.find((s) => s.id === fee.studentId)?.name}</td>
                            <td className="px-4 py-3">{fee.feeType}</td>
                            <td className="px-4 py-3 text-right font-medium">₹{fee.amount.toLocaleString()}</td>
                            <td className="px-4 py-3">{fee.dueDate}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                fee.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}>
                                {fee.status === "paid" ? "✓ Paid" : "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Announcements</h3>
                  <button
                    onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {showAnnouncementForm ? "Cancel" : "+ New Announcement"}
                  </button>
                </div>

                {showAnnouncementForm && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <input
                      type="text"
                      placeholder="Announcement Title"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Announcement Content"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, content: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddAnnouncement}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Post Announcement
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900">{ann.title}</h4>
                      <p className="text-gray-700 mt-1">{ann.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{ann.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === "facilities" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">College Facilities</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map((facility) => (
                    <div key={facility.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{facility.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          facility.status === "available" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Capacity: {facility.capacity} persons</p>
                      <p className="text-sm text-gray-600">Location: {facility.floor} Floor</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Important Documents</h3>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">📄 {doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type} • Uploaded by {doc.uploadedBy} • {doc.date}</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
