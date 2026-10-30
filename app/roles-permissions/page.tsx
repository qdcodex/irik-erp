"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { CustomRole, RolePermission } from "@/lib/types";
import SearchableSelect from "@/components/SearchableSelect";

const ALL_MODULES = [
  "Admissions",
  "Students",
  "Timetable",
  "Attendance",
  "Fees & Finance",
  "HR & Payroll",
  "Assets & Fleet",
  "E-Learning / LMS",
  "Feedback & Tickets",
  "Visitor & Gate",
  "Admin Settings",
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<CustomRole[]>(store.getCustomRoles());
  const [selectedRoleId, setSelectedRoleId] = useState<string>("1");
  const [permissions, setPermissions] = useState<RolePermission[]>(store.getRolePermissions(selectedRoleId));

  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDepartment, setNewRoleDepartment] = useState("Operations");

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setPermissions(store.getRolePermissions(roleId));
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    const created = store.addCustomRole({
      name: newRoleName,
      tier: "manager",
      department: newRoleDepartment,
      isCustom: true,
    });
    setRoles(store.getCustomRoles());
    setSelectedRoleId(created.id);
    setNewRoleName("");
    alert(`Created custom role: ${created.name}`);
  };

  const handleTogglePermission = (
    moduleName: string,
    action: "view" | "create" | "edit" | "delete" | "approve"
  ) => {
    const existing = permissions.find((p) => p.module === moduleName);
    const currentActions = existing ? existing.actions : { view: false, create: false, edit: false, delete: false, approve: false };
    const updatedActions = {
      ...currentActions,
      [action]: !currentActions[action],
    };

    store.updateRolePermission(selectedRoleId, moduleName, updatedActions);
    setPermissions(store.getRolePermissions(selectedRoleId));
  };

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-xl p-6 text-white shadow-md">
          <div>
            <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-indigo-400/30">
              Irik.md Section 4.18
            </span>
            <h1 className="text-2xl font-bold mt-2">Dynamic Roles & Granular Permission Matrix</h1>
            <p className="text-sm text-gray-300">
              Department-scoped custom roles, access control matrices & module-level privileges (View, Create, Edit, Delete, Approve)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles Selector Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">System & Custom Roles</h3>
              <div className="space-y-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex justify-between items-center transition ${
                      selectedRoleId === r.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div>
                      <p className="font-bold">{r.name}</p>
                      <p className={`text-[10px] ${selectedRoleId === r.id ? "text-blue-100" : "text-gray-400"}`}>
                        {r.department} • Tier: {r.tier}
                      </p>
                    </div>
                    {r.isCustom && (
                      <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                        CUSTOM
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Custom Role */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 text-xs mb-2">+ Create Custom Role</h4>
              <form onSubmit={handleCreateRole} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flight Ops Officer"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full border rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Department"
                    value={newRoleDepartment}
                    onChange={(val) => setNewRoleDepartment(val)}
                    options={["Operations", "Academics", "Finance", "Security"]}
                    size="sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded text-xs transition"
                >
                  Add Custom Role
                </button>
              </form>
            </div>
          </div>

          {/* Granular Permission Matrix Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Permissions Matrix for: <span className="text-blue-600">{selectedRole.name}</span>
                  </h3>
                  <p className="text-xs text-gray-500">Toggle privileges per functional ERP module</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                  Department: {selectedRole.department}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                      <th className="px-6 py-3 font-semibold">ERP Module</th>
                      <th className="px-4 py-3 font-semibold text-center">View</th>
                      <th className="px-4 py-3 font-semibold text-center">Create</th>
                      <th className="px-4 py-3 font-semibold text-center">Edit</th>
                      <th className="px-4 py-3 font-semibold text-center">Delete</th>
                      <th className="px-4 py-3 font-semibold text-center">Approve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ALL_MODULES.map((modName) => {
                      const modPerm = permissions.find((p) => p.module === modName);
                      const isSuperAdmin = selectedRole.tier === "super_admin";
                      const actions = modPerm ? modPerm.actions : { view: isSuperAdmin, create: isSuperAdmin, edit: isSuperAdmin, delete: isSuperAdmin, approve: isSuperAdmin };

                      return (
                        <tr key={modName} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-900">{modName}</td>
                          {(["view", "create", "edit", "delete", "approve"] as const).map((action) => (
                            <td key={action} className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={actions[action]}
                                onChange={() => handleTogglePermission(modName, action)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
