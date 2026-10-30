"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import SearchableSelect from "@/components/SearchableSelect";

export default function HostelPage() {
  const [rooms, setRooms] = useState(store.getHostelRooms());
  const [allocations, setAllocations] = useState(store.getRoomAllocations());
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNumber: "",
    capacity: 2,
    type: "double" as "single" | "double" | "triple",
    floorNumber: 1,
    charges: 50000,
  });
  const [allocationForm, setAllocationForm] = useState({
    roomId: "",
    studentId: "",
    semester: 4,
  });

  const students = store.getStudents();

  const handleRoomChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "floorNumber" || name === "charges"
          ? parseInt(value)
          : value,
    }));
  };

  const handleAllocationChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAllocationForm((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) : value,
    }));
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom = store.addHostelRoom({
      ...roomForm,
      occupancy: 0,
    });
    setRooms([...rooms, newRoom]);
    setShowRoomForm(false);
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
    const newAllocation = store.addRoomAllocation({
      ...allocationForm,
      allocationDate: new Date().toISOString().split("T")[0],
      status: "active",
    });
    setAllocations([...allocations, newAllocation]);
    setShowAllocationForm(false);
    setAllocationForm({
      roomId: "",
      studentId: "",
      semester: 4,
    });
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Unknown";
  };

  const getRoomNumber = (id: string) => {
    return rooms.find((r) => r.id === id)?.roomNumber || "Unknown";
  };

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupancy = allocations.filter((a) => a.status === "active").length;
  const occupancyRate = totalCapacity > 0
    ? ((totalOccupancy / totalCapacity) * 100).toFixed(1)
    : 0;

  const singleRooms = rooms.filter((r) => r.type === "single").length;
  const doubleRooms = rooms.filter((r) => r.type === "double").length;
  const tripleRooms = rooms.filter((r) => r.type === "triple").length;

  return (
    <AppLayout>
    
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hostel Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowRoomForm(!showRoomForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showRoomForm ? "Cancel" : "+ Add Room"}
          </button>
          <button
            onClick={() => setShowAllocationForm(!showAllocationForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {showAllocationForm ? "Cancel" : "+ Allocate"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600">Total Rooms</p>
          <p className="text-2xl font-bold text-blue-700">{rooms.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">Occupancy Rate</p>
          <p className="text-2xl font-bold text-green-700">{occupancyRate}%</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600">Occupied Beds</p>
          <p className="text-2xl font-bold text-purple-700">{totalOccupancy}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-600">Total Capacity</p>
          <p className="text-2xl font-bold text-orange-700">{totalCapacity}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Single Rooms</p>
          <p className="text-2xl font-bold text-gray-900">{singleRooms}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Double Rooms</p>
          <p className="text-2xl font-bold text-gray-900">{doubleRooms}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Triple Rooms</p>
          <p className="text-2xl font-bold text-gray-900">{tripleRooms}</p>
        </div>
      </div>

      {showRoomForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={roomForm.roomNumber}
                  onChange={handleRoomChange}
                  required
                  placeholder="e.g., 101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <SearchableSelect
                  label="Room Type"
                  name="type"
                  value={roomForm.type}
                  onChange={(value) => handleRoomChange({ target: { name: "type", value } } as any)}
                  options={[
                    { value: "single", label: "Single" },
                    { value: "double", label: "Double" },
                    { value: "triple", label: "Triple" },
                  ]}
                  placeholder="Select Room Type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={roomForm.capacity}
                  onChange={handleRoomChange}
                  min="1"
                  max="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor Number
                </label>
                <input
                  type="number"
                  name="floorNumber"
                  value={roomForm.floorNumber}
                  onChange={handleRoomChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charges per Semester (₹)
                </label>
                <input
                  type="number"
                  name="charges"
                  value={roomForm.charges}
                  onChange={handleRoomChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Room
            </button>
          </form>
        </div>
      )}

      {showAllocationForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleAllocateRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SearchableSelect
                  label="Room *"
                  name="roomId"
                  value={allocationForm.roomId}
                  onChange={(value) => handleAllocationChange({ target: { name: "roomId", value } } as any)}
                  options={rooms.map((r) => ({ value: r.id, label: `Room ${r.roomNumber} (${r.type})` }))}
                  placeholder="Select Room"
                  required
                />
              </div>
              <div>
                <SearchableSelect
                  label="Student *"
                  name="studentId"
                  value={allocationForm.studentId}
                  onChange={(value) => handleAllocationChange({ target: { name: "studentId", value } } as any)}
                  options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))}
                  placeholder="Select Student"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <input
                  type="number"
                  name="semester"
                  value={allocationForm.semester}
                  onChange={handleAllocationChange}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Allocate Room
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Room Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Room
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Floor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Capacity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {room.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {room.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      Floor {room.floorNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {room.capacity}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{room.charges.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Room Allocations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Room
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    From Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {getRoomNumber(alloc.roomId)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {getStudentName(alloc.studentId)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {alloc.allocationDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          alloc.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {alloc.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
