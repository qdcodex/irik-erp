"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import SearchableSelect from "@/components/SearchableSelect";

export default function LibraryPage() {
  const [books, setBooks] = useState(store.getLibraryBooks());
  const [issues, setIssues] = useState(store.getBookIssues());
  const [showBookForm, setShowBookForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Programming",
    totalCopies: 1,
    publicationYear: new Date().getFullYear(),
  });

  const students = store.getStudents();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalCopies" || name === "publicationYear"
          ? parseInt(value)
          : value,
    }));
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = store.addLibraryBook({
      ...formData,
      availableCopies: formData.totalCopies,
    });
    setBooks([...books, newBook]);
    setShowBookForm(false);
    setFormData({
      isbn: "",
      title: "",
      author: "",
      category: "Programming",
      totalCopies: 1,
      publicationYear: new Date().getFullYear(),
    });
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Unknown";
  };

  const getBookTitle = (id: string) => {
    return books.find((b) => b.id === id)?.title || "Unknown";
  };

  const handleReturnBook = (id: string) => {
    const updated = store.returnBook(id);
    if (updated) {
      setIssues(issues.map((i) => (i.id === id ? updated : i)));
    }
  };

  const issuedCount = issues.filter((i) => i.status === "issued").length;
  const returnedCount = issues.filter((i) => i.status === "returned").length;
  const overdueCount = issues.filter((i) => i.status === "overdue").length;

  return (
    <AppLayout>
    
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Library Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowBookForm(!showBookForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showBookForm ? "Cancel" : "+ Add Book"}
          </button>
          <button
            onClick={() => setShowIssueForm(!showIssueForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {showIssueForm ? "Cancel" : "+ Issue Book"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600">Total Books</p>
          <p className="text-2xl font-bold text-blue-700">{books.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">Books Issued</p>
          <p className="text-2xl font-bold text-green-700">{issuedCount}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-600">Returned</p>
          <p className="text-2xl font-bold text-yellow-700">{returnedCount}</p>
        </div>
      </div>

      {showBookForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <SearchableSelect
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  options={[
                    { value: "Programming", label: "Programming" },
                    { value: "Design Patterns", label: "Design Patterns" },
                    { value: "Database", label: "Database" },
                    { value: "Web Development", label: "Web Development" },
                  ]}
                  placeholder="Select Category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Copies
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Book
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Book Catalog</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        book.availableCopies > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.availableCopies}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {book.totalCopies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showIssueForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Issue Book to Student</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Implementation for issuing books
              setShowIssueForm(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SearchableSelect
                  label="Student *"
                  value=""
                  onChange={() => {}}
                  options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))}
                  placeholder="Select Student"
                />
              </div>
              <div>
                <SearchableSelect
                  label="Book *"
                  value=""
                  onChange={() => {}}
                  options={books.map((b) => ({ value: b.id, label: b.title }))}
                  placeholder="Select Book"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Issue Book
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Book Issue Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getStudentName(issue.studentId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getBookTitle(issue.bookId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {issue.issueDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {issue.dueDate}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        issue.status === "returned"
                          ? "bg-green-100 text-green-800"
                          : issue.status === "overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {issue.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {issue.status !== "returned" && (
                      <button
                        onClick={() => handleReturnBook(issue.id)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
