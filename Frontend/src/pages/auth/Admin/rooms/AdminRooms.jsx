// src/pages/auth/Admin/rooms/AdminRooms.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoomCard from "./RoomCard";
import RoomFormModal from "./RoomFormModal";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // === FETCH ROOMS DARI BACKEND ===
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
  try {
    const res = await fetch("http://localhost:8080/admin/room");
    
    if (!res.ok) {
      const errText = await res.text();
      console.error("HTTP Error:", res.status, errText);
      throw new Error(`Gagal koneksi: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    console.log("Raw data dari backend:", data); // LIHAT INI DI CONSOLE!

    // CEK APAKAH DATA ARRAY
    let roomList = [];
    if (Array.isArray(data)) {
      roomList = data;
    } else if (data && Array.isArray(data.rooms)) {
      roomList = data.rooms;
    } else if (data === null || data === undefined) {
      console.log("Data null/undefined → kosong");
      roomList = [];
    } else {
      console.warn("Data bukan array:", data);
      roomList = [];
    }

    const normalized = roomList.map(r => ({
      id: r.id || r._id || r.Id || "",
      name: r.name || r.Name || "Tanpa Nama",
      type: r.type || r.Type || "Glamping",
      status: r.availability === false ? "maintenance" : "available",
      price: Number(r.price_per_night || r.PricePerNight || 0),
      capacity: Number(r.capacity || r.Capacity || 2),
      size: 0,
      bed: r.bed_type || r.Bed_type || "Queen Bed",
      description: r.description || r.Description || "",
      facilities: r.facilities || r.Facilities || [],
      image: r.images && r.images.length > 0 
        ? `http://localhost:8080${r.images[0]}` 
        : "https://placehold.co/600x400/CCCCCC/666666?text=No+Image",
      updatedAt: r.updated_at 
        ? new Date(Number(r.updated_at)).toLocaleDateString("id-ID")
        : "N/A",
      room_number: r.room_number || r.RoomNumber || "",
      category: r.category || r.Category || ""
    }));

    setRooms(normalized);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Gagal load kamar: " + err.message);
  } finally {
    setLoading(false);
  }
};

  // === FILTER ===
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || room.status === filterStatus;
      const matchesType = filterType === "all" || room.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, search, filterStatus, filterType]);

  // === CREATE / UPDATE ===
  const handleSave = async (formData) => { // formData HARUS berupa objek FormData dari modal
    const isEdit = !!editingRoom;
    const url = isEdit
      ? `http://localhost:8080/admin/edit-room/${editingRoom.id}` // Ganti :id dengan ID kamar
      : "http://localhost:8080/admin/create-room";

    try {
      const res = await fetch(url, {
        method: "POST",
        // [KRUSIAL] Body adalah objek FormData. JANGAN SET Content-Type!
        body: formData, 
      });

      if (res.ok) {
        // Berhasil: Tutup modal dan refresh daftar
        alert(isEdit ? "Kamar berhasil diperbarui!" : "Kamar berhasil dibuat!");
        fetchRooms();
        setIsModalOpen(false);
        setEditingRoom(null);
      } else {
        // Gagal: Tampilkan pesan error dari backend
        const errMsg = await res.text();
        console.error("Error Response:", errMsg);
        alert("Gagal simpan data. Cek Console untuk detail.");
      }
    } catch (err) {
      // Gagal koneksi (CORS/Server mati)
      console.error("Fetch Error:", err);
      alert("Gagal terhubung ke server Go. Pastikan server berjalan dan CORS sudah benar.");
    }
};

  // === DELETE ===
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus kamar ini?")) return;
    try {
      const res = await fetch(`http://localhost:8080/admin/delete-room/${id}`, {
        method: "POST", // backend pakai POST
      });
      if (res.ok) {
        fetchRooms();
      } else {
        alert("Gagal hapus");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-emerald-800 mb-2">Manajemen Kamar</h1>
        <p className="text-gray-600">Kelola semua kamar dan akomodasi Astro Ciater</p>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {["all", "available", "maintenance"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  filterStatus === s
                    ? s === "all" ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {s === "all" ? "Semua" : s === "available" ? "Tersedia" : "Maintenance"}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {["all", "Glamping", "Villa", "Cottage", "Cabin"].map((t) => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  filterType === t ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {t === "all" ? "Semua Tipe" : t}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text" placeholder="Cari kamar..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 text-black"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            + Tambah Kamar
          </motion.button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">Loading kamar...</div>
      ) : (

      /* Room Grid */
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={() => { setEditingRoom(room); setIsModalOpen(true); }}
              onDelete={() => handleDelete(room.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      )}

      {/* Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
        onSave={handleSave}
        initialData={editingRoom}
      />
    </div>
  );
}