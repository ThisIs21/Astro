// src/pages/auth/Admin/users/UserRow.jsx
import React from "react";
import { motion } from "framer-motion";
import { Eye, Edit, Trash2, Calendar, DollarSign } from "lucide-react";

const roleColors = {
  Admin: "bg-purple-100 text-purple-700",
  Resepsionis: "bg-amber-100 text-amber-700",
  Pelanggan: "bg-blue-100 text-blue-700",
};

export default function UserRow({ user, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : d.toLocaleDateString("id-ID");
  };

  // Pastikan semua field aman
  const name = user.Name || user.name || "Tanpa Nama";
  const email = user.Email || user.email || "-";
  const noTlp = user.NoTlp || user.noTlp || "-";
  const role = user.Role || user.role || "Unknown";
  const createdAt = user.CreatedAt || user.createdAt;
  const id = user.Id || user.id || user._id || "";

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 transition"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">ID: {id.slice(-6)}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900">{email}</p>
          <p className="text-xs text-gray-500">{noTlp}</p>
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            roleColors[role] || "bg-gray-100 text-gray-700"
          }`}
        >
          {role}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Bergabung: {formatDate(createdAt)}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-700">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Rp 0</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">0 reservasi</p>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onEdit(user)}
            className="p-2 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(user.Id)}
            className="p-2 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
