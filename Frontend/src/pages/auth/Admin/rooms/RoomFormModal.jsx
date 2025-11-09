// src/pages/auth/Admin/rooms/RoomFormModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Users, Bed, Image as ImageIcon, Hash } from "lucide-react";

const roomTypes = ["Glamping", "Villa", "Cottage", "Cabin"];
const facilitiesList = ["AC", "WiFi", "Private Bathroom", "Kitchen", "Bathtub", "Balcony", "TV", "Fireplace", "Hot Tub"];

export default function RoomFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "", type: "Glamping", price: "", capacity: 2, bed: "", description: "",
    facilities: [], image: "", imageFile: null, room_number: "", category: ""
  });

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "Glamping",
        price: initialData.price.toString(),
        capacity: initialData.capacity.toString(),
        bed: initialData.bed || "",
        description: initialData.description || "",
        facilities: initialData.facilities || [],
        image: initialData.image || "",
        imageFile: null,
        room_number: initialData.room_number || "",
        category: initialData.category || ""
      });
    } else {
      setFormData({
        name: "", type: "Glamping", price: "", capacity: 2, bed: "", description: "",
        facilities: [], image: "", imageFile: null, room_number: "", category: ""
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFacility = (f) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter(x => x !== f)
        : [...prev.facilities, f]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      updatedAt: new Date().toISOString().split("T")[0],
      status: initialData?.status || "available"
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-emerald-800">
                  {isEditing ? "Edit Kamar" : "Tambah Kamar"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Kamar" icon={Bed} value={formData.name} onChange={v => handleChange('name', v)} required />
                <Input label="Nomor Kamar" icon={Hash} value={formData.room_number} onChange={v => handleChange('room_number', v)} />
                <Select label="Tipe" value={formData.type} onChange={v => handleChange('type', v)} options={roomTypes} />
                <Input label="Kategori" value={formData.category} onChange={v => handleChange('category', v)} placeholder="Premium, Standard, dll" />

                <Input label="Harga per Malam (Rp)" icon={DollarSign} type="number" value={formData.price} onChange={v => handleChange('price', v)} required />
                <Input label="Kapasitas" icon={Users} type="number" value={formData.capacity} onChange={v => handleChange('capacity', v)} min="1" required />
                <Input label="Tipe Tempat Tidur" icon={Bed} value={formData.bed} onChange={v => handleChange('bed', v)} placeholder="King Bed" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar Kamar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
                />
                {formData.image && (
                  <img src={formData.image} alt="preview" className="mt-3 h-40 w-full object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Fasilitas</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilitiesList.map(f => (
                    <label
                      key={f}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
                        ${formData.facilities.includes(f) ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(f)}
                        onChange={() => toggleFacility(f)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2"
                >
                  {isEditing ? "Update" : "Simpan"} Kamar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300"
                >
                  Batal
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper Components
const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 outline-none ${Icon ? 'pl-10' : ''}`}
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select
      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 outline-none bg-white"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);