"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import SearchableSelect from "@/components/SearchableSelect";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  Building2,
  PlusCircle,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Bed,
  Phone,
  Mail,
  X,
  Send,
  UserCheck,
  DoorOpen,
  Coffee,
  Moon,
  MessageSquare,
} from "lucide-react";

export default function HostelPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canManage = isAdmin || isStaff;
  const isStudent = user?.role === "student";

  const [rooms, setRooms] = useState(store.getHostelRooms());
  const [allocations, setAllocations] = useState(store.getRoomAllocations());

  // Modal States
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  // Forms
  const [roomForm, setRoomForm] = useState({
    roomNumber: "",
    capacity: 2,
    type: "double" as "single" | "double" | "triple",
    floorNumber: 1,
    charges: 50000,
  });

  const [allocationForm, setAllocationForm] = useState({
    roomId: "",
    studentId: "1",
    semester: 4,
  });

  const students = store.getStudents();

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    const newRoom = store.addHostelRoom({
      ...roomForm,
      occupancy: 0,
    });
    setRooms(store.getHostelRooms());
    setShowRoomModal(false);
    setRoomForm({
      roomNumber: "",
      capacity: 2,
      type: "double",
      floorNumber: 1,
      charges: 50000,
    });
  };

  const handleAllocateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage || !allocationForm.roomId || !allocationForm.studentId) return;

    store.addRoomAllocation({
      ...allocationForm,
      allocationDate: new Date().toISOString().split("T")[0],
      status: "active",
    });
    setAllocations(store.getRoomAllocations());
    setRooms(store.getHostelRooms());
    setShowAllocateModal(false);
    setAllocationForm({
      roomId: "",
      studentId: "1",
      semester: 4,
    });
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Cadet";
  };

  const getRoomNumber = (id: string) => {
    return rooms.find((r) => r.id === id)?.roomNumber || "N/A";
  };

  // Metrics
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const activeAllocations = allocations.filter((a) => a.status === "active");
  const totalOccupancy = activeAllocations.length;
  const occupancyRate =
    totalCapacity > 0 ? ((totalOccupancy / totalCapacity) * 100).toFixed(1) : "0";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Cockpit Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-slate-800/80">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  Cadet Aircrew Quarters & Residency
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                  Blocks A & B • 24/7 Security & DGCA Curfew Enforced
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-blue-400" />
                Cadet Hostel & Residential Quarters
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Aviation student residential blocks, room allocations, flight duty curfew monitoring, and quarters administration.
              </p>
            </div>

            {/* Role-Specific Actions: ONLY Admins & Staff see "+ Add Room" and "+ Allocate" */}
            {canManage ? (
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition border border-slate-700 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>+ Add Room</span>
                </button>
                <button
                  onClick={() => setShowAllocateModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>+ Allocate Bed</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Residency Status: <strong className="text-white">Active Resident</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Student View: "My Cadet Quarters & Room Details" */}
        {isStudent && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Assigned Quarters
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-blue-600" />
                  Cadet Room 204 • Block B (Aircrew Residency)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Semester 4 Room Dues Settled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Room Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Room Configuration
                </span>
                <p className="text-sm font-bold text-slate-900">Double Occupancy (Floor 2)</p>
                <div className="text-xs text-slate-600 space-y-1 pt-1 font-mono">
                  <p>Bed Allocation: <strong>Bed A (East Wing)</strong></p>
                  <p>Study Station: <strong>Desk #204-A</strong></p>
                  <p>Locker: <strong>Secured Keypad #204A</strong></p>
                </div>
              </div>

              {/* Roommate Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Cadet Roommate
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cadet Arjun Singh</p>
                    <p className="text-[10px] text-slate-500 font-mono">AVN-2026-002 • Pilot Training</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Shared Ground School Schedule
                </p>
              </div>

              {/* Warden Contact */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Hostel Warden Desk
                </span>
                <p className="text-xs font-bold text-slate-900">Major R. K. Sharma (Retd.)</p>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-mono">+91 98450 12345</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Office: Ground Floor, Block B</p>
                </div>
              </div>
            </div>

            {/* Mess & Curfew Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">Mess & Dining Timings</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Breakfast: 06:30 - 08:00 | Lunch: 12:30 - 14:00 | Dinner: 19:30 - 21:00
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/70 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">DGCA Night Curfew Policy</h4>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    Mandatory biometric scan by 21:30 hrs prior to simulator / dawn sorties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Quarters
            </span>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {rooms.length} Rooms
            </p>
            <p className="text-xs text-slate-500 mt-1">Blocks A & B</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Occupancy Rate
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
              {occupancyRate}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Standard Aircrew Capacity</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Allocated Beds
            </span>
            <p className="text-2xl font-black text-blue-600 mt-2 font-mono">
              {totalOccupancy} Cadets
            </p>
            <p className="text-xs text-slate-500 mt-1">Active Residents</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Available Beds
            </span>
            <p className="text-2xl font-black text-amber-600 mt-2 font-mono">
              {Math.max(0, totalCapacity - totalOccupancy)} Vacant
            </p>
            <p className="text-xs text-slate-500 mt-1">Ready for New Entrants</p>
          </div>
        </div>

        {/* Room Inventory & Allocations Table (Visible to Admin & Staff) */}
        {canManage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Room Inventory */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Room Inventory ({rooms.length})</h3>
                  <p className="text-xs text-slate-500">Bed configuration & semester fee tariffs</p>
                </div>
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Add Room
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Room No</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Floor</th>
                      <th className="py-3 px-4">Capacity</th>
                      <th className="py-3 px-4 text-right">Fee / Sem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          Room {room.roomNumber}
                        </td>
                        <td className="py-3 px-4 capitalize text-slate-700">
                          {room.type}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          Floor {room.floorNumber}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">
                          {room.capacity} Beds
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ₹{room.charges.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Allocations */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Active Allocations ({allocations.length})
                  </h3>
                  <p className="text-xs text-slate-500">Assigned cadets and residency dates</p>
                </div>
                <button
                  onClick={() => setShowAllocateModal(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Allocate Bed
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Cadet</th>
                      <th className="py-3 px-4">Room</th>
                      <th className="py-3 px-4">Semester</th>
                      <th className="py-3 px-4">Since</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {getStudentName(alloc.studentId)}
                        </td>
                        <td className="py-3 px-4 text-blue-700 font-semibold font-mono">
                          Room {getRoomNumber(alloc.roomId)}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          Sem {alloc.semester}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {alloc.allocationDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            {alloc.status}
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

        {/* MODAL 1: ADD HOSTEL ROOM */}
        {showRoomModal && canManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <DoorOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Add Cadet Residential Room</h3>
                    <p className="text-[11px] text-slate-300">
                      Configure room number, floor and bed capacity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddRoom} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 205"
                      value={roomForm.roomNumber}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, roomNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Floor Number *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={6}
                      value={roomForm.floorNumber}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, floorNumber: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <SearchableSelect
                      label="Room Configuration *"
                      value={roomForm.type}
                      onChange={(val) =>
                        setRoomForm({
                          ...roomForm,
                          type: val as "single" | "double" | "triple",
                          capacity: val === "single" ? 1 : val === "double" ? 2 : 3,
                        })
                      }
                      options={[
                        { value: "single", label: "Single (1 Cadet)" },
                        { value: "double", label: "Double (2 Cadets)" },
                        { value: "triple", label: "Triple (3 Cadets)" },
                      ]}
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Charges per Semester (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={roomForm.charges}
                      onChange={(e) =>
                        setRoomForm({ ...roomForm, charges: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowRoomModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs"
                  >
                    Register Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ALLOCATE BED TO STUDENT */}
        {showAllocateModal && canManage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Allocate Cadet Bed</h3>
                    <p className="text-[11px] text-slate-300">
                      Assign student to residential room inventory
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllocateModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAllocateRoom} className="p-6 space-y-4">
                <div>
                  <SearchableSelect
                    label="Cadet / Student *"
                    value={allocationForm.studentId}
                    onChange={(val) => setAllocationForm({ ...allocationForm, studentId: val })}
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
                    label="Select Room *"
                    value={allocationForm.roomId}
                    onChange={(val) => setAllocationForm({ ...allocationForm, roomId: val })}
                    options={rooms.map((r) => ({
                      value: r.id,
                      label: `Room ${r.roomNumber} (${r.type})`,
                      sublabel: `Floor ${r.floorNumber} • ₹${r.charges.toLocaleString()}/sem`,
                    }))}
                    placeholder="Choose room..."
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={allocationForm.semester}
                    onChange={(e) =>
                      setAllocationForm({
                        ...allocationForm,
                        semester: parseInt(e.target.value) || 4,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAllocateModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs"
                  >
                    Authorize Allocation
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
