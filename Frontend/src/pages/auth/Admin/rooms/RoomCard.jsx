// src/pages/auth/Admin/rooms/RoomCard.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bed, Users, Ruler, Calendar, Edit, Trash2, Eye } from "lucide-react";
import RoomDetailModal from "./RoomDetailModal"; 

// --- Warna Badge Status ---
const statusColors = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-700",
};

// --- Warna Badge Tipe (Diubah ke -500 agar teks hitam kontras) ---
const typeColors = {
  Glamping: "bg-emerald-500",
  Villa: "bg-amber-500",
  Cottage: "bg-orange-500",
  Cabin: "bg-teal-500",
};


export default function RoomCard({ room, onEdit, onDelete }) {
  const [showDetail, setShowDetail] = useState(false);
  
  const handleShowDetail = (e) => {
    e.stopPropagation();
    setShowDetail(true);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -6 }}
        // Menggunakan flex-col dan justify-between untuk menjamin layout seragam
        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        {/* GAMBAR DAN BADGE (Bagian atas) */}
        <div className="relative h-56 flex-shrink-0">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />

          {/* Ikon Mata - Kiri Atas */}
          <motion.button
            onClick={handleShowDetail}
            whileHover={{ scale: 1.1 }}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 text-white shadow-lg transition duration-200"
            title="Lihat Detail Ruangan"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Status dan Tipe Badges - Kanan Atas */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[room.status]}`}>
              {room.status === "available" ? "Tersedia" : room.status === "occupied" ? "Terisi" : "Maintenance"}
            </span>
            {/* Teks hitam/gelap pada badge tipe */}
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-gray-900 ${typeColors[room.type]}`}>
              {room.type}
            </span>
          </div>
        </div>

        {/* KONTEN (Bagian Tengah - Memastikan Kesejajaran) */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{room.name}</h3>
          <p className="text-2xl font-bold text-emerald-600 mb-3">
            Rp {room.price.toLocaleString("id-ID")}
          </p>
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{room.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>{room.capacity} tamu</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Ruler className="w-4 h-4 text-emerald-600" />
              <span>{room.size} m²</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Bed className="w-4 h-4 text-emerald-600" />
              <span>{room.bed}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-xs">{room.updatedAt}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
            {room.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
              >
                {facility}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{room.facilities.length - 3} lainnya
              </span>
            )}
          </div>
          
          {/* AKSI (Bagian Bawah - Didesak ke Bawah oleh mt-auto) */}
          <div className="flex gap-3 mt-auto pt-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEdit}
              className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDelete}
              className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal Detail */}
      <RoomDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        room={room}
      />
    </>
  );
}