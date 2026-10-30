"use client";

import { store } from "@/lib/store";
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import SearchableSelect from "@/components/SearchableSelect";
import { useAuth } from "@/lib/auth-context";
import {
  Library as LibraryIcon,
  BookOpen,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Send,
  Calendar,
  User,
  ShieldCheck,
  BookmarkCheck,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";

const AVIATION_CATEGORIES = [
  "All Categories",
  "DGCA Flight Navigation",
  "Aviation Meteorology",
  "Air Regulations & Law",
  "Aircraft Technical & Engines",
  "Principles of Flight & Aerodynamics",
  "Aviation Management & Airport Ops",
  "Cabin Safety & Emergency Procedures",
];

export default function LibraryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canManage = isAdmin || isStaff;
  const isStudent = user?.role === "student";

  const [books, setBooks] = useState(store.getLibraryBooks());
  const [issues, setIssues] = useState(store.getBookIssues());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Add Book Form State
  const [bookFormData, setBookFormData] = useState({
    isbn: "978-0-123456-78-9",
    title: "",
    author: "",
    category: "DGCA Flight Navigation",
    totalCopies: 5,
    publicationYear: 2026,
  });

  // Issue Book Form State
  const [issueFormData, setIssueFormData] = useState({
    studentId: "1",
    bookId: "",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const students = store.getStudents();

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    const newBook = store.addLibraryBook({
      ...bookFormData,
      availableCopies: bookFormData.totalCopies,
    });
    setBooks(store.getLibraryBooks());
    setShowAddModal(false);
    setBookFormData({
      isbn: "978-0-" + Math.floor(Math.random() * 899999 + 100000) + "-1",
      title: "",
      author: "",
      category: "DGCA Flight Navigation",
      totalCopies: 5,
      publicationYear: 2026,
    });
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage || !issueFormData.bookId || !issueFormData.studentId) return;

    const selectedBook = books.find((b) => b.id === issueFormData.bookId);
    if (!selectedBook || selectedBook.availableCopies <= 0) {
      alert("Error: No copies of this book are currently available for issue.");
      return;
    }

    const newIssue = store.addBookIssue({
      bookId: issueFormData.bookId,
      studentId: issueFormData.studentId,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: issueFormData.dueDate,
      status: "issued",
    });

    setIssues(store.getBookIssues());
    setBooks(store.getLibraryBooks());
    setShowIssueModal(false);
    setIssueFormData({
      studentId: "1",
      bookId: "",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  };

  const handleReturnBook = (issueId: string) => {
    if (!canManage) return;
    const updated = store.returnBook(issueId);
    if (updated) {
      setIssues(store.getBookIssues());
      setBooks(store.getLibraryBooks());
    }
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Cadet";
  };

  const getBookTitle = (id: string) => {
    return books.find((b) => b.id === id)?.title || "Flight Manual";
  };

  // Metrics
  const totalBooksCount = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalAvailableCount = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const issuedCount = issues.filter((i) => i.status === "issued").length;

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === "All Categories" || book.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Student specific borrowed books
  const currentStudentId = user?.username === "student" ? "1" : "1";
  const myBorrowedBooks = issues.filter(
    (i) => i.studentId === currentStudentId && i.status === "issued"
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Cockpit Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-slate-800/80">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  DGCA Ground School Resource Center
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                  Standard Operating Procedures & Flight Manuals
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <LibraryIcon className="w-6 h-6 text-blue-400" />
                Aviation Technical Library & Manuals
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                DGCA CPL/ATPL reference literature, aircraft POH operating handbooks, radio phraseology guides, and air navigation charts.
              </p>
            </div>

            {/* Role-Specific Actions: ONLY Admins & Staff see "+ Add Book" and "+ Issue Book" */}
            {canManage ? (
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition border border-slate-700 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>+ Add Book</span>
                </button>
                <button
                  onClick={() => setShowIssueModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>+ Issue Book</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>Cadet Lending Card: <strong className="text-white">Active (Limit: 3)</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Student View: "My Borrowed Aviation Manuals & Books" */}
        {isStudent && myBorrowedBooks.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-200/80 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                My Active Borrowed Manuals ({myBorrowedBooks.length})
              </h3>
              <span className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                Lending Desk: Ground Floor Hangar A
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {myBorrowedBooks.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white p-3.5 rounded-xl border border-blue-200/90 shadow-2xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {getBookTitle(issue.bookId)}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      Issued
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-mono">
                    <span>Due: <strong>{issue.dueDate}</strong></span>
                    <span className="text-blue-600 flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3" /> Return to Library
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Titles in Catalog
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {books.length} Titles
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {totalBooksCount} Physical Volume Copies
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Currently Available
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
              {totalAvailableCount} Copies
            </p>
            <p className="text-xs text-slate-500 mt-1">Ready for Immediate Cadet Lending</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Issues
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2 font-mono">
              {issuedCount} Manuals Checked Out
            </p>
            <p className="text-xs text-slate-500 mt-1">Due within 14 Flight Cycle Days</p>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {AVIATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Catalog Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Technical Catalog & Flight Manuals ({filteredBooks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Official syllabus publications and aircraft performance documentation
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add New Manual
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Title & ISBN</th>
                  <th className="py-3.5 px-4">Author / Publisher</th>
                  <th className="py-3.5 px-4">Subject Category</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Total Copies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{book.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ISBN: {book.isbn} • Edition: {book.publicationYear}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {book.author}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {book.availableCopies > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {book.availableCopies} Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          All Copies Issued
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      {book.totalCopies}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Administration Section: Book Issue Records (Visible to Admin & Staff) */}
        {canManage && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                  Cadet Lending & Circulation Records
                </h3>
                <p className="text-xs text-slate-500">
                  Track checked-out books, return compliance and overdue manuals
                </p>
              </div>

              <button
                onClick={() => setShowIssueModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Issue New Book</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Cadet / Student</th>
                    <th className="py-3.5 px-4">Book Title</th>
                    <th className="py-3.5 px-4">Issue Date</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {getStudentName(issue.studentId)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {getBookTitle(issue.bookId)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {issue.issueDate}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono font-medium">
                        {issue.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            issue.status === "returned"
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : issue.status === "overdue"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {issue.status !== "returned" && (
                          <button
                            onClick={() => handleReturnBook(issue.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition"
                          >
                            Mark Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD BOOK MODAL */}
        {showAddModal && canManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Add Aviation Book to Catalog</h3>
                    <p className="text-[11px] text-slate-300">
                      Standard flight syllabus reference literature
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddBook} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Book / Manual Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford Aviation: Air Law & Operational Procedures"
                    value={bookFormData.title}
                    onChange={(e) =>
                      setBookFormData({ ...bookFormData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Author / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Capt. Trevor Thom"
                      value={bookFormData.author}
                      onChange={(e) =>
                        setBookFormData({ ...bookFormData, author: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ISBN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={bookFormData.isbn}
                      onChange={(e) =>
                        setBookFormData({ ...bookFormData, isbn: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <SearchableSelect
                    label="Subject Category *"
                    value={bookFormData.category}
                    onChange={(val) => setBookFormData({ ...bookFormData, category: val })}
                    options={AVIATION_CATEGORIES.filter((c) => c !== "All Categories")}
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Volume Copies
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      value={bookFormData.totalCopies}
                      onChange={(e) =>
                        setBookFormData({
                          ...bookFormData,
                          totalCopies: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={2030}
                      value={bookFormData.publicationYear}
                      onChange={(e) =>
                        setBookFormData({
                          ...bookFormData,
                          publicationYear: parseInt(e.target.value) || 2026,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs"
                  >
                    Add to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ISSUE BOOK TO STUDENT */}
        {showIssueModal && canManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <BookmarkCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Issue Flight Manual to Cadet</h3>
                    <p className="text-[11px] text-slate-300">
                      Standard 14-day flight ground school lending cycle
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleIssueBook} className="p-6 space-y-4">
                <div>
                  <SearchableSelect
                    label="Cadet / Student *"
                    value={issueFormData.studentId}
                    onChange={(val) => setIssueFormData({ ...issueFormData, studentId: val })}
                    options={students.map((s) => ({
                      value: s.id,
                      label: `${s.name} (${s.rollNo})`,
                      sublabel: `${s.course} • Sem ${s.semester}`,
                    }))}
                    size="sm"
                  />
                </div>

                <div>
                  <SearchableSelect
                    label="Select Available Book *"
                    value={issueFormData.bookId}
                    onChange={(val) => setIssueFormData({ ...issueFormData, bookId: val })}
                    options={books.map((b) => ({
                      value: b.id,
                      label: b.title,
                      sublabel: `${b.category} • ${b.availableCopies} Copies Available`,
                    }))}
                    placeholder="Choose manual to issue..."
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Return Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={issueFormData.dueDate}
                    onChange={(e) =>
                      setIssueFormData({ ...issueFormData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs"
                  >
                    Authorize & Issue Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
