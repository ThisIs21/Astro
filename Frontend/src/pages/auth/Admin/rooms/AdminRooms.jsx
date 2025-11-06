// src/pages/auth/Admin/rooms/AdminRooms.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoomCard from "./RoomCard";
import RoomFormModal from "./RoomFormModal";

const initialRooms = [
  {
    id: 1,
    name: "Glamping Premium Kebun Teh",
    type: "Glamping",
    status: "available",
    price: 850000,
    capacity: 4,
    size: 35,
    bed: "King Bed",
    description: "Tenda glamping premium dengan pemandangan kebun teh langsung.",
    facilities: ["AC", "Private Bathroom", "Tea Garden View", "WiFi"],
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80",
    updatedAt: "2025-11-06",
  },
  {
    id: 2,
    name: "Glamping Standard Alam",
    type: "Glamping",
    status: "occupied",
    price: 650000,
    capacity: 2,
    size: 25,
    bed: "Queen Bed",
    description: "Tenda glamping nyaman dengan suasana alam tenang.",
    facilities: ["Fan", "Shared Bathroom", "Garden View"],
    image: "https://images.unsplash.com/photo-1510312302256-7c6eb968c9d7?w=800&q=80",
    updatedAt: "2025-11-05",
  },
  {
    id: 3,
    name: "Villa Keluarga Ciater",
    type: "Villa",
    status: "available",
    price: 1200000,
    capacity: 6,
    size: 80,
    bed: "2 Queen Beds",
    description: "Villa keluarga luas dengan pemandangan pegunungan.",
    facilities: ["AC", "Private Kitchen", "Living Room", "Bathtub"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    updatedAt: "2025-11-04",
  },
  {
    id: 4,
    name: "Cottage Romantis",
    type: "Cottage",
    status: "maintenance",
    price: 750000,
    capacity: 2,
    size: 30,
    bed: "Queen Bed",
    description: "Cottage romantis untuk pasangan dengan suasana hangat.",
    facilities: ["Fireplace", "Private Balcony", "Hot Tub"],
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16eafc?w=800&q=80",
    updatedAt: "2025-11-03",
  },
];

const statusColors = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-700",
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState(initialRooms);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || room.status === filterStatus;
      const matchesType = filterType === "all" || room.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, search, filterStatus, filterType]);

  const handleSave = (roomData) => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...r, ...roomData, updatedAt: new Date().toISOString().split("T")[0] } : r)));
    } else {
      const newRoom = {
        ...roomData,
        id: Date.now(),
        status: "available",
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setRooms([...rooms, newRoom]);
    }
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus kamar ini?")) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-emerald-800 mb-2">Manajemen Kamar</h1>
        <p className="text-gray-600">Kelola semua kamar dan akomodasi Astro Ciater</p>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {["all", "available", "occupied", "maintenance"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  filterStatus === status
                    ? status === "all"
                      ? "bg-emerald-600 text-white"
                      : statusColors[status]
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "Semua" : status === "available" ? "Tersedia" : status === "occupied" ? "Terisi" : "Maintenance"}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {["all", "Glamping", "Villa", "Cottage", "Cabin"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  filterType === type
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type === "all" ? "Semua Tipe" : type}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari kamar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingRoom(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition flex items-center gap-2"
          >
            + Tambah Kamar
          </motion.button>
        </div>
      </div>

      {/* Room Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={() => {
                setEditingRoom(room);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDelete(room.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoom(null);
        }}
        onSave={handleSave}
        initialData={editingRoom}
      />
    </div>
  );
}