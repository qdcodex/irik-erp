"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { IDCard } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  CreditCard,
  Printer,
  Plus,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Lock,
  User,
} from "lucide-react";

export default function IDCardsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  const allStudents = store.getStudents();
  const allCards = store.getIDCards();

  // Find matching student if role is student
  const loggedInStudent = isStudent
    ? allStudents.find(
        (s) =>
          (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
          (user?.fullName && s.name.toLowerCase() === user.fullName.toLowerCase()) ||
          (user?.username && s.rollNo.toLowerCase() === user.username.toLowerCase()) ||
          (user?.username && s.name.toLowerCase().includes(user.username.toLowerCase()))
      ) || allStudents[0]
    : null;

  // Filter cards if student role
  const scopedCards = isStudent && loggedInStudent
    ? allCards.filter(
        (c) =>
          c.ownerId === loggedInStudent.id ||
          c.name.toLowerCase() === loggedInStudent.name.toLowerCase() ||
          c.rollOrEmpNo.toLowerCase() === loggedInStudent.rollNo.toLowerCase()
      )
    : allCards;

  const initialCard = scopedCards.length > 0 ? scopedCards[0] : allCards[0];
  const [cards, setCards] = useState<IDCard[]>(allCards);
  const [selectedCard, setSelectedCard] = useState<IDCard>(initialCard);

  const [newCard, setNewCard] = useState({
    ownerType: "student" as IDCard["ownerType"],
    ownerId: "3",
    name: "Ankit Sharma",
    rollOrEmpNo: "CS003",
    departmentOrCourse: "BBA Aviation",
    bloodGroup: "O+",
    emergencyContact: "+91 98765 11223",
    issuedDate: new Date().toISOString().split("T")[0],
    validUntil: "2028-08-01",
    qrPayload: "IRIK-STU-CS003-ANKIT",
    status: "active" as IDCard["status"],
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const created = store.addIDCard(newCard);
    const updatedCards = store.getIDCards();
    setCards(updatedCards);
    setSelectedCard(created);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  Digital Smart Badge
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admin Issuer
                  </span>
                ) : isStudent ? (
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-blue-500/30 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Cadet: {loggedInStudent?.name}
                  </span>
                ) : (
                  <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-slate-600/40 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Read Only
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold mt-2 text-white">
                {isStudent ? `Cadet Photo ID Pass: ${loggedInStudent?.name}` : "Digital ID Card Generator & QR Badges"}
              </h1>
              <p className="text-xs text-slate-300">
                {isStudent
                  ? "Your official IRIK Academy airside flight line pass with encoded biometric barcode"
                  : "Aviation-grade student & staff photo ID cards with encoded QR check-in tags and high-resolution print layouts"}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Preview (Front & Back Layout) */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Live Smart Badge Preview</h3>

            {/* FRONT OF BADGE */}
            <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-amber-400 text-blue-950 flex items-center justify-center font-black text-xs">
                    IRIK
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-wider uppercase">IRIK AVIATION</p>
                    <p className="text-[9px] text-amber-300 tracking-tight">DGCA Approved Academy</p>
                  </div>
                </div>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold">
                  {selectedCard?.ownerType ? selectedCard.ownerType.toUpperCase() : "STUDENT"}
                </span>
              </div>

              <div className="py-5 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-700 p-1 shadow-lg mb-3 flex items-center justify-center text-2xl font-bold text-white border-2 border-amber-300">
                  {selectedCard?.name ? selectedCard.name.charAt(0) : "C"}
                </div>
                <h4 className="font-bold text-base text-white leading-tight">{selectedCard?.name}</h4>
                <p className="text-xs text-amber-300 font-mono font-semibold mt-0.5">{selectedCard?.rollOrEmpNo}</p>
                <p className="text-xs text-slate-200 mt-1">{selectedCard?.departmentOrCourse}</p>
              </div>

              {/* Data Strip */}
              <div className="bg-black/40 backdrop-blur rounded-xl p-3 text-[11px] grid grid-cols-2 gap-2 border border-white/10">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Blood Group</span>
                  <span className="font-bold text-amber-300">{selectedCard?.bloodGroup || "O+"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Valid Until</span>
                  <span className="font-semibold text-slate-100">{selectedCard?.validUntil || "2028-08-01"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[9px] uppercase">Emergency Contact</span>
                  <span className="font-mono text-slate-200">{selectedCard?.emergencyContact || "+91 98765 11223"}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center text-slate-900 font-mono text-[8px] font-bold text-center leading-3">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                  <div className="text-[10px] text-slate-300">
                    <p className="font-mono">{selectedCard?.qrPayload || "IRIK-CADET-PASS"}</p>
                    <p className="text-emerald-400 font-semibold text-[9px]">● Scannable RFID / Gate Tag</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                  selectedCard?.status === "active"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                Status: {selectedCard?.status ? selectedCard.status.toUpperCase() : "ACTIVE"}
              </span>
            </div>
          </div>

          {/* Directory & Admin Generator (Only for Non-Student roles) */}
          {!isStudent && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Issued Academy ID Cards Directory
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                        <th className="p-3">Name</th>
                        <th className="p-3">Roll / Emp ID</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cards.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCard(c)}
                          className={`hover:bg-slate-50 transition cursor-pointer ${
                            selectedCard?.id === c.id ? "bg-blue-50/70 font-semibold" : ""
                          }`}
                        >
                          <td className="p-3">{c.name}</td>
                          <td className="p-3 font-mono">{c.rollOrEmpNo}</td>
                          <td className="p-3 uppercase text-[10px]">{c.ownerType}</td>
                          <td className="p-3">{c.departmentOrCourse}</td>
                          <td className="p-3 text-right">
                            <button className="text-blue-600 font-semibold hover:underline">Select</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Generator Form */}
              {isAdmin && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    Issue New ID Card Pass
                  </h3>
                  <form onSubmit={handleCreateCard} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newCard.name}
                          onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                          className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Roll / Emp ID</label>
                        <input
                          type="text"
                          required
                          value={newCard.rollOrEmpNo}
                          onChange={(e) => setNewCard({ ...newCard, rollOrEmpNo: e.target.value })}
                          className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                    >
                      Generate Badge
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
