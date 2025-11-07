// src/pages/auth/Admin/users/AdminUsers.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserRow from "./UserRow";
import UserFormModal from "./UserFormModal";
import { Users, UserCheck, UserX, Shield, Search } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users dari backend Go
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/user");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.Name.toLowerCase().includes(search.toLowerCase()) ||
                          user.Email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === "all" || user.Role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.Role !== "Diblokir").length,
    customers: users.filter(u => u.Role === "Pelanggan").length,
    admins: users.filter(u => u.Role === "Admin").length,
  };

  const handleSave = async (userData) => {
    const method = editingUser ? "POST" : "POST";
    const url = editingUser 
      ? `http://localhost:8080/admin/edit-user/${editingUser.Id}`
      : "http://localhost:8080/admin/create-user";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        fetchUsers();
        setIsModalOpen(false);
        setEditingUser(null);
      }
    } catch (err) {
      alert("Gagal simpan user",err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus user ini?")) return;
    try {
      await fetch(`http://localhost:8080/admin/delete-user/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      alert("Gagal hapus",err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-emerald-800">Manajemen Pengguna</h1>
            <p className="text-gray-600 mt-1">Kelola akun pengguna dan admin sistem</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Tambah Pengguna
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Pengguna", value: stats.total, icon: Users, color: "blue" },
          { label: "Pengguna Aktif", value: stats.active, icon: UserCheck, color: "emerald" },
          { label: "Pelanggan", value: stats.customers, icon: UserX, color: "amber" },
          { label: "Admin", value: stats.admins, icon: Shield, color: "purple" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {["all", "Admin", "Pelanggan"].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-5 py-2.5 rounded-full font-medium transition ${
                  filterRole === role
                    ? role === "all" ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {role === "all" ? "Semua" : role}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["PENGGUNA", "KONTAK", "ROLE", "AKTIVITAS", "STATISTIK", "AKSI"].map(header => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-12">Loading...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-500">Tidak ada data</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <UserRow
                      key={user.Id}
                      user={user}
                      onEdit={() => { setEditingUser(user); setIsModalOpen(true); }}
                      onDelete={() => handleDelete(user.Id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        onSave={handleSave}
        initialData={editingUser}
      />
    </div>
  );
}