// src/pages/auth/Admin/rooms/RoomDetailModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

export default function RoomDetailModal({ isOpen, onClose, room }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {" "}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
         {" "}
        <div className="relative">
            {" "}
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
            {" "}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 **text-gray-800** bg-white/80 backdrop-blur rounded-full hover:bg-white transition"
          >
              <X className="w-5 h-5" />  {" "}
          </button>
           {" "}
        </div>
         {" "}
        <div className="p-6">
            {" "}
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">
            {room.name}
          </h2>
            {" "}
          <p className="text-2xl font-bold text-emerald-600 mb-4">
              Rp {room.price.toLocaleString("id-ID")} / malam  
            {" "}
          </p>
            {" "}
          <div className="grid grid-cols-2 gap-6 mb-6">
             {" "}
            <div>
                 <p className="text-sm text-gray-500">Tipe Kamar</p>
                <p className="font-bold text-gray-800">{room.type}</p>
               {" "}
            </div>
             {" "}
            <div>
                 <p className="text-sm text-gray-500">Status</p>
               {" "}
              <p className="font-bold capitalize text-emerald-700">
                   {" "}
                {room.status === "available"
                  ? "Tersedia"
                  : room.status === "occupied"
                  ? "Terisi"
                  : "Pemeliharaan"}
                  {" "}
              </p>
               {" "}
            </div>
             {" "}
            <div>
                 <p className="text-sm text-gray-500">Kapasitas</p>
               {" "}
              <p className="font-bold text-gray-800">{room.capacity} tamu</p> 
               {" "}
            </div>
             {" "}
            <div>
                 <p className="text-sm text-gray-500">Ukuran</p>
                <p className="font-bold text-gray-800">{room.size} m²</p>
                {" "}
            </div>
             {" "}
            <div>
                {" "}
              <p className="text-sm text-gray-500">Tempat Tidur</p>  {" "}
              <p className="font-bold text-gray-800">{room.bed}</p> {" "}
            </div>
             {" "}
            <div>
                {" "}
              <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
               {" "}
              <p className="font-bold text-gray-800">{room.updatedAt}</p> 
               {" "}
            </div>
              {" "}
          </div>
            {" "}
          <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Deskripsi</p>
              {" "}
            <p className="text-gray-700 leading-relaxed">{room.description}</p>
             {" "}
          </div>
            {" "}
          <div>
             {" "}
            <p className="text-sm font-bold text-gray-700 mb-3">
              Fasilitas Lengkap
            </p>
             {" "}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {" "}
              {room.facilities.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg"
                >
                    {" "}
                  <CheckCircle className="w-5 h-5 text-emerald-600" />  
                   {" "}
                  <span className="text-sm font-medium text-gray-800">{f}</span>
                     {" "}
                </div>
              ))}
               {" "}
            </div>
              {" "}
          </div>
           {" "}
        </div>
        {" "}
      </motion.div>
       {" "}
    </motion.div>
  );
}
