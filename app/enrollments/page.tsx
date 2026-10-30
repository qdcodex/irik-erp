"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import SearchableSelect from "@/components/SearchableSelect";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState(store.getEnrollments());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    semester: 1,
  });

  const students = store.getStudents();
  const courses = store.getCourses();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnrollment = store.addEnrollment(formData);
    setEnrollments([...enrollments, newEnrollment]);
    setShowForm(false);
    setFormData({
      studentId: "",
      courseId: "",
      semester: 1,
    });
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Unknown";
  };

  const getCourseName = (id: string) => {
    return courses.find((c) => c.id === id)?.name || "Unknown";
  };

  return (
    <AppLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enrollment Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Enrollment"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Enrollment
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Student
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Marks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getStudentName(enrollment.studentId)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getCourseName(enrollment.courseId)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {enrollment.semester}
                </td>
                <td className="px-6 py-4 text-sm">
                  {enrollment.grade ? (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {enrollment.grade}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {enrollment.marks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AppLayout>
  );
}

