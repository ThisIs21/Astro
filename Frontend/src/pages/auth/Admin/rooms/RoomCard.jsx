// src/pages/auth/Admin/rooms/RoomCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bed, Users, Ruler, Calendar, Edit, Trash2, Eye } from "lucide-react";
import RoomDetailModal from "./RoomDetailModal";

const statusColors = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-700",
};

const typeColors = {
  Glamping: "bg-emerald-500",
  Villa: "bg-amber-500",
  Cottage: "bg-orange-500",
  Cabin: "bg-teal-500",
};

export default function RoomCard({ room, onEdit, onDelete }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -6 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        {/* GAMBAR */}
        <div className="relative h-56 flex-shrink-0">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://placehold.co/600x400/CCCCCC/666666?text=No+Image"; }}
          />

          <motion.button
            onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
            whileHover={{ scale: 1.1 }}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 text-white shadow-lg"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[room.status]}`}>
              {room.status === "available" ? "Tersedia" : room.status === "occupied" ? "Terisi" : "Maintenance"}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-gray-900 ${typeColors[room.type] || "bg-gray-500"}`}>
              {room.type}
            </span>
          </div>
        </div>

        {/* KONTEN */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{room.name}</h3>
          <p className="text-xs text-gray-500 mb-2">No: {room.room_number || "N/A"}</p>
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
              <Bed className="w-4 h-4 text-emerald-600" />
              <span>{room.bed}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-xs">{room.updatedAt}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {room.facilities.slice(0, 3).map((f) => (
              <span key={f} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                {f}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{room.facilities.length - 3}
              </span>
            )}
          </div>

          {/* AKSI */}
          <div className="flex gap-3 mt-auto pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </motion.button>
          </div>
        </div>
      </motion.div>

      <RoomDetailModal isOpen={showDetail} onClose={() => setShowDetail(false)} room={room} />
    </>
  );
}