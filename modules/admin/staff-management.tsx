"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Layers, Plus, Search, Edit2, Trash2, 
  CheckCircle2, XCircle, UserPlus, Table as TableIcon,
  Filter, MoreVertical, ChevronRight, UserCircle,
  LayoutGrid, List, Save, X
} from "lucide-react";

// Types
interface Waiter {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  assignedTables: string[];
  joinedAt: string;
}

interface Table {
  id: string;
  number: string;
  capacity: number;
  section: string;
  status: "available" | "occupied" | "reserved";
  assignedWaiterId?: string;
}

// Mock Data
const MOCK_WAITERS: Waiter[] = [
  { id: "W1", name: "Ahmed Khan", phone: "0300-1234567", email: "ahmed@pos.com", status: "active", assignedTables: ["T1", "T2"], joinedAt: "2024-01-10" },
  { id: "W2", name: "Sara Malik", phone: "0321-7654321", email: "sara@pos.com", status: "active", assignedTables: ["T3"], joinedAt: "2024-02-15" },
  { id: "W3", name: "Bilal Raza", phone: "0311-9988776", email: "bilal@pos.com", status: "inactive", assignedTables: [], joinedAt: "2023-11-20" },
];

const MOCK_TABLES: Table[] = [
  { id: "T1", number: "Table 01", capacity: 4, section: "Main Hall", status: "available", assignedWaiterId: "W1" },
  { id: "T2", number: "Table 02", capacity: 2, section: "Window Side", status: "occupied", assignedWaiterId: "W1" },
  { id: "T3", number: "Table 03", capacity: 6, section: "Main Hall", status: "reserved", assignedWaiterId: "W2" },
  { id: "T4", number: "Table 04", capacity: 4, section: "Main Hall", status: "available" },
];

export function StaffManagement() {
  const [activeTab, setActiveTab] = useState<"waiters" | "tables">("waiters");
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- API Base URL ---
  const API_BASE = "http://127.0.0.1:8000/api";

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/waiters`),
        fetch(`${API_BASE}/tables`)
      ]);
      const [wData, tData] = await Promise.all([wRes.json(), tRes.json()]);
      setWaiters(wData);
      setTables(tData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers for Waiters ---
  const handleSaveWaiter = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("HandleSaveWaiter triggered");
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      status: "active",
      assignedTables: editingItem?.assignedTables || []
    };

    try {
      console.log("Saving waiter data:", data);
      const url = editingItem ? `${API_BASE}/waiters/${editingItem.id}` : `${API_BASE}/waiters`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Server Error:", errData);
        alert(`Error: ${errData.detail || "Failed to save waiter"}`);
        return;
      }

      console.log("Waiter saved successfully");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Network or Fetch Error:", err);
      alert("Could not connect to backend. Please make sure the backend is running.");
    }
  };

  const handleDeleteWaiter = async (id: string) => {
    if (!confirm("Delete this waiter?")) return;
    try {
      await fetch(`${API_BASE}/waiters/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // --- Handlers for Tables ---
  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("HandleSaveTable triggered");
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      number: formData.get("number"),
      capacity: parseInt(formData.get("capacity") as string),
      section: formData.get("section"),
      status: editingItem?.status || "available",
      assignedWaiterId: editingItem?.assignedWaiterId || null
    };

    try {
      console.log("Saving table data:", data);
      const url = editingItem ? `${API_BASE}/tables/${editingItem.id}` : `${API_BASE}/tables`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Server Error:", errData);
        alert(`Error: ${errData.detail || "Failed to save table"}`);
        return;
      }

      console.log("Table saved successfully");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Network or Fetch Error:", err);
      alert("Could not connect to backend. Please make sure the backend is running.");
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm("Delete this table?")) return;
    try {
      await fetch(`${API_BASE}/tables/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const assignWaiterToTable = async (tableId: string, waiterId: string) => {
    try {
      await fetch(`${API_BASE}/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedWaiterId: waiterId || null })
      });
      fetchData();
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const filteredWaiters = waiters.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTables = tables.filter(t => 
    t.number.toLowerCase().includes(search.toLowerCase()) || 
    t.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Outfit', sans-serif", color: "#1e293b", padding: "32px" }}>
      
      {/* Header Area */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>Supervisor Console</h1>
          <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>Manage your staff, tables, and floor assignments</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1e293b", color: "white", border: "none", padding: "12px 20px", borderRadius: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          >
            <Plus size={18} /> {activeTab === "waiters" ? "Add Waiter" : "Add Table"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0" }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => setActiveTab("waiters")}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", border: "none", fontSize: "15px", fontWeight: 700, cursor: "pointer", background: activeTab === "waiters" ? "#f1f5f9" : "transparent", color: activeTab === "waiters" ? "#1e293b" : "#94a3b8", transition: "all 0.2s" }}
            >
              <Users size={18} /> Waiters
            </button>
            <button 
              onClick={() => setActiveTab("tables")}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", border: "none", fontSize: "15px", fontWeight: 700, cursor: "pointer", background: activeTab === "tables" ? "#f1f5f9" : "transparent", color: activeTab === "tables" ? "#1e293b" : "#94a3b8", transition: "all 0.2s" }}
            >
              <TableIcon size={18} /> Floor Tables
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`} 
              style={{ width: "100%", height: "44px", borderRadius: "12px", border: "1px solid #e2e8f0", paddingLeft: "40px", fontSize: "14px", background: "#f8fafc", color: "#1e293b", outline: "none" }} 
            />
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          
          {activeTab === "waiters" ? (
            filteredWaiters.map(waiter => (
              <div key={waiter.id} style={{ background: "#fcfcfd", borderRadius: "20px", padding: "20px", border: "1px solid #f1f5f9", position: "relative", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
                    <UserCircle size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: 0 }}>{waiter.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: waiter.status === "active" ? "#10b981" : "#94a3b8" }} />
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{waiter.status}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>Phone:</span> <span style={{ fontWeight: 700, color: "#1e293b" }}>{waiter.phone}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>Email:</span> <span style={{ fontWeight: 700, color: "#1e293b" }}>{waiter.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Joined:</span> <span style={{ fontWeight: 700, color: "#1e293b" }}>{new Date(waiter.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                   {waiter.assignedTables && waiter.assignedTables.length > 0 ? (
                     waiter.assignedTables.map(t => (
                       <span key={t} style={{ background: "#f1f5f9", color: "#64748b", fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "100px" }}>{t}</span>
                     ))
                   ) : (
                     <span style={{ color: "#94a3b8", fontSize: "11px", fontStyle: "italic" }}>No tables assigned</span>
                   )}
                </div>

                <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                  <button 
                    onClick={() => { setEditingItem(waiter); setIsModalOpen(true); }}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "40px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", color: "#1e293b", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteWaiter(waiter.id)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "40px", borderRadius: "10px", border: "none", background: "#fee2e2", color: "#ef4444", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            filteredTables.map(table => {
              const assignedWaiter = waiters.find(w => w.id === table.assignedWaiterId);
              return (
                <div key={table.id} style={{ background: "#fcfcfd", borderRadius: "20px", padding: "20px", border: "1px solid #f1f5f9", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b" }}>
                      <TableIcon size={24} />
                    </div>
                    <span style={{ 
                      padding: "4px 12px", 
                      borderRadius: "100px", 
                      fontSize: "11px", 
                      fontWeight: 800, 
                      textTransform: "uppercase",
                      background: table.status === "available" ? "#d1fae5" : table.status === "occupied" ? "#fee2e2" : "#fef3c7",
                      color: table.status === "available" ? "#10b981" : table.status === "occupied" ? "#ef4444" : "#f59e0b"
                    }}>
                      {table.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>{table.number}</h3>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>{table.capacity} Seats</span>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>•</span>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>{table.section}</span>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "14px", border: "1px solid #f1f5f9", marginBottom: "20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Assigned Waiter</div>
                    {assignedWaiter ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: "10px" }}>
                           <Users size={12} />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{assignedWaiter.name}</span>
                        <button 
                           onClick={() => assignWaiterToTable(table.id, "")}
                           style={{ marginLeft: "auto", background: "none", border: "none", color: "#ef4444", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
                        >
                          Unassign
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>No staff assigned</span>
                        <select 
                          onChange={(e) => assignWaiterToTable(table.id, e.target.value)}
                          style={{ marginLeft: "auto", height: "30px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", fontWeight: 700, padding: "0 8px", background: "white", outline: "none" }}
                        >
                          <option value="">Assign Staff</option>
                          {waiters.filter(w => w.status === "active").map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => { setEditingItem(table); setIsModalOpen(true); }}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "40px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", color: "#1e293b", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTable(table.id)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "40px", borderRadius: "10px", border: "none", background: "#fee2e2", color: "#ef4444", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form 
            onSubmit={activeTab === "waiters" ? handleSaveWaiter : handleSaveTable}
            style={{ background: "white", borderRadius: "28px", padding: "32px", width: "440px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>
                {editingItem ? `Edit ${activeTab === "waiters" ? "Waiter" : "Table"}` : `Add New ${activeTab === "waiters" ? "Waiter" : "Table"}`}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                   {activeTab === "waiters" ? "Full Name" : "Table Number"}
                </label>
                <input 
                  name={activeTab === "waiters" ? "name" : "number"}
                  required
                  defaultValue={editingItem ? (activeTab === "waiters" ? editingItem.name : editingItem.number) : ""}
                  placeholder={activeTab === "waiters" ? "e.g. John Doe" : "e.g. Table 15"}
                  style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", fontSize: "14px", background: "#f8fafc", outline: "none" }} 
                />
              </div>

              {activeTab === "waiters" ? (
                <>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Phone Number</label>
                    <input 
                      name="phone"
                      required
                      defaultValue={editingItem?.phone}
                      placeholder="0300-1234567"
                      style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", fontSize: "14px", background: "#f8fafc", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Email Address</label>
                    <input 
                      name="email"
                      type="email"
                      required
                      defaultValue={editingItem?.email}
                      placeholder="john@example.com"
                      style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", fontSize: "14px", background: "#f8fafc", outline: "none" }} 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Section / Zone</label>
                    <input 
                      name="section"
                      required
                      defaultValue={editingItem?.section}
                      placeholder="e.g. Terrace"
                      style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", fontSize: "14px", background: "#f8fafc", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Capacity (Seats)</label>
                    <input 
                      name="capacity"
                      type="number"
                      required
                      defaultValue={editingItem ? editingItem.capacity : 4}
                      style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", fontSize: "14px", background: "#f8fafc", outline: "none" }} 
                    />
                  </div>
                </>
              )}

              <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, height: "52px", borderRadius: "16px", border: "1px solid #e2e8f0", background: "white", color: "#1e293b", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                   type="submit"
                   style={{ flex: 1, height: "52px", borderRadius: "16px", border: "none", background: "#1e293b", color: "white", fontSize: "15px", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)" }}
                >
                  {editingItem ? "Update" : "Save Waiter"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
