"use client";

import { Student } from "@/lib/types";
import { FormEvent, useState } from "react";
import SearchableSelect from "./SearchableSelect";

type StudentFormProps = {
  onSubmit: (student: Omit<Student, "id">) => void;
};

export default function StudentForm({ onSubmit }: StudentFormProps) {
  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    course: "B.Tech CS",
    semester: 1,
    address: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      rollNo: "",
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "Male",
      course: "B.Tech CS",
      semester: 1,
      address: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll No *
          </label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CS001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <SearchableSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
            placeholder="Select gender..."
          />
        </div>
        <div>
          <SearchableSelect
            label="Course"
            name="course"
            value={formData.course}
            onChange={(value) => setFormData((prev) => ({ ...prev, course: value }))}
            options={[
              { value: "B.Tech CS", label: "B.Tech CS" },
              { value: "B.Tech ECE", label: "B.Tech ECE" },
              { value: "B.Tech Mechanical", label: "B.Tech Mechanical" },
              { value: "BCA", label: "BCA" },
            ]}
            placeholder="Select course..."
          />
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
      >
        Add Student
      </button>
    </form>
  );
}
