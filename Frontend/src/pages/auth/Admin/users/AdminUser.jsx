// src/pages/auth/Admin/users/AdminUsers.jsx - RESOLVED
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/user");
      if (!res.ok) throw new Error("Gagal koneksi"); // Pilihan: madd (lebih detail)

      const data = await res.json();
      console.log("Data dari server:", data); // Pilihan: main (message lebih umum)

      const userList = Array.isArray(data) ? data : data.users || [];

      // NORMALISASI DATA (Gabungan lengkap)
      const normalized = userList.map(u => ({
        Id: u.id || u.Id || u._id?.toString() || "", // Pilihan: madd (memastikan string)
        Name: u.Name || u.name || "Tanpa Nama",
        Email: u.Email || u.email || "-",
        NoTlp: u.NoTlp || u.noTlp || "-",
        Role: u.Role || u.role || "Resepsionis",
        CreatedAt: u.CreatedAt || u.createdAt
      }));

      setUsers(normalized);
    } catch (err) {
      console.error("Error:", err);
      alert("Gagal ambil data user"); // Pilihan: main (lebih spesifik)
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        (user.Name?.toLowerCase() || "").includes(searchLower) ||
        (user.Email?.toLowerCase() || "").includes(searchLower);
      const matchesRole = filterRole === "all" || user.Role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.Role !== "Diblokir").length,
    customers: users.filter(u => u.Role === "Resepsionis").length,
    admins: users.filter(u => u.Role === "Admin").length,
  };

  const handleSave = async (userData) => {
    const isEdit = !!editingUser; // Pilihan: madd (logika yang lebih eksplisit)
    const url = isEdit
      ? `http://localhost:8080/admin/edit-user/${editingUser.Id}`
      : "http://localhost:8080/admin/create-user";

    // Pastikan ID tidak ikut jika create (Logika yang lebih aman dari madd)
    const body = isEdit ? userData : { ...userData };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchUsers();
        setIsModalOpen(false);
        setEditingUser(null);
      } else {
        const err = await res.text(); // Pilihan: madd (dapat pesan error dari Go)
        alert("Gagal simpan: " + err);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus user ini?")) return; // Pilihan: madd (konfirmasi lebih jelas)
    try {
      const res = await fetch(`http://localhost:8080/admin/delete-user/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Gagal hapus: " + await res.text()); // Pilihan: madd (dapat pesan error dari Go)
      }
    } catch (err) {
      alert("Error: " + err.message);
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Pengguna", value: stats.total, icon: Users, color: "blue" }, // Pilihan: madd (label lebih lengkap)
          { label: "Pengguna Aktif", value: stats.active, icon: UserCheck, color: "emerald" }, // Pilihan: madd (label lebih lengkap)
          { label: "Resepsionis", value: stats.customers, icon: UserX, color: "amber" },
          { label: "Admin", value: stats.admins, icon: Shield, color: "purple" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md p-5">
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

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {["all", "Admin", "Resepsionis"].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)} // Pilihan: madd (mempertahankan formatting)
                className={`px-5 py-2.5 rounded-full font-medium transition ${
                  filterRole === role
                    ? role === "all" ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
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
                onChange={e => setSearch(e.target.value)} // Pilihan: madd (mempertahankan formatting)
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 transition text-black" // Pilihan: madd (tambahan text-black)
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table (Tidak ada konflik) */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["PENGGUNA", "KONTAK", "ROLE", "AKTIVITAS", "STATISTIK", "AKSI"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {h}
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

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        onSave={handleSave}
        initialData={editingUser}
      />
    </div>
  );
}