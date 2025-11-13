// src/pages/auth/Admin/users/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function UserFormModal({ isOpen, onClose, onSave, initialData }) {
 const [form, setForm] = useState({
  Name: "", Email: "", NoTlp: "", Password: "", Role: "Resepsionis"
 });

 useEffect(() => {
  if (initialData) {
   // Pastikan data yang dimuat adalah string, bukan objek
   setForm({
    Name: initialData.Name || "",
    Email: initialData.Email || "",
    NoTlp: initialData.NoTlp || "",
    Password: "",
    Role: initialData.Role || "Resepsionis"
   });
  } else {
   setForm({ Name: "", Email: "", NoTlp: "", Password: "", Role: "Resepsionis" });
  }
 }, [initialData]);

 const handleSubmit = (e) => {
  e.preventDefault();
  onSave(form);
 };

 if (!isOpen) return null;

 return (
  <motion.div
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
   onClick={onClose}
  >
   <motion.div
    initial={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
    onClick={e => e.stopPropagation()}
   >
    <div className="p-6 border-b">
     <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-emerald-800">
       {initialData ? "Edit Pengguna" : "Tambah Pengguna"}
      </h2>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
       <X className="w-5 h-5" />
      </button>
     </div>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-5">
     <Input label="Nama Lengkap" value={form.Name} onChange={v => setForm(prev => ({...prev, Name: v}))} required />
     <Input label="Email" type="email" value={form.Email} onChange={v => setForm(prev => ({...prev, Email: v}))} required />
     <Input label="No. Telepon" value={form.NoTlp} onChange={v => setForm(prev => ({...prev, NoTlp: v}))} required />
     <Input 
      label="Password" 
      type="password" 
      value={form.Password} 
      onChange={v => setForm(prev => ({...prev, Password: v}))} 
      placeholder={initialData ? "Kosongkan jika tidak ingin ganti" : "Masukkan password"} 
      required={!initialData} 
     />
     
     <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
      <select
       value={form.Role}
       onChange={e => setForm(prev => ({...prev, Role: e.target.value}))}
       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 outline-none text-black" // Tambah text-black untuk select
      >
       <option value="Resepsionis">Resepsionis</option>
       <option value="Admin">Admin</option>
      </select>
     </div>

     <div className="flex gap-3 pt-4">
      <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
       {initialData ? "Update" : "Simpan"}
      </button>
      <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">
       Batal
      </button>
     </div>
    </form>
   </motion.div>
  </motion.div>
 );
}

/**
 * KOMPONEN INPUT YANG SUDAH DIFIX
 * Fix 1: Menangkap onChange event dan memanggil onChange prop dengan e.target.value
 * Fix 2: Menambahkan text-black untuk memastikan teks input terlihat
 */
const Input = ({ label, onChange, ...props }) => (
 <div>
  <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
  <input
   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-black"
   onChange={(e) => onChange(e.target.value)} // <-- FIX: Mengambil nilai string (e.target.value)
   {...props}
  />
 </div>
);