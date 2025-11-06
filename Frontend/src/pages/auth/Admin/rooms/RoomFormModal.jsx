import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Users, Ruler, Bed, Image as ImageIcon } from "lucide-react"; // Tambahkan ImageIcon untuk URL Gambar

const roomTypes = ["Glamping", "Villa", "Cottage", "Cabin"];
const facilitiesList = ["AC", "WiFi", "Private Bathroom", "Kitchen", "Bathtub", "Balcony", "TV", "Fireplace", "Hot Tub"];

// URL gambar placeholder yang lebih spesifik
const defaultImages = {
  Glamping: "https://placehold.co/600x400/81C784/FFFFFF?text=Glamping+Tent",
  Villa: "https://placehold.co/600x400/4DB6AC/FFFFFF?text=Luxury+Villa",
  Cottage: "https://placehold.co/600x400/A1887F/FFFFFF?text=Cozy+Cottage",
  Cabin: "https://placehold.co/600x400/90A4AE/FFFFFF?text=Forest+Cabin",
};

// --- Komponen Modal Utama ---
export default function RoomFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "", type: "Glamping", price: "", capacity: 2, size: "", bed: "", description: "", facilities: [], image: ""
  });
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      // Pastikan nilai-nilai numerik diubah kembali ke string untuk input
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        capacity: initialData.capacity.toString(),
        size: initialData.size.toString(),
        facilities: initialData.facilities || [],
        image: initialData.image || defaultImages[initialData.type] // Pastikan image ada
      });
    } else {
      setFormData({
        name: "", type: "Glamping", price: "", capacity: 2, size: "", bed: "", description: "", facilities: [], image: defaultImages.Glamping
      });
    }
  }, [initialData]);

  // Handler perubahan input umum
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    // Logika khusus untuk memperbarui gambar default saat tipe kamar berubah
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value,
        image: defaultImages[value] || prev.image // Ganti gambar hanya jika ada default
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      ...formData, 
      // Mengubah string kembali ke number saat menyimpan
      price: Number(formData.price), 
      capacity: Number(formData.capacity), 
      size: Number(formData.size),
      updatedAt: new Date().toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), // Format tanggal lebih detail
      status: initialData ? initialData.status : 'available' // Pertahankan status jika edit
    });
    onClose(); // Tutup modal setelah disimpan
  };

  const toggleFacility = (f) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter(x => x !== f)
        : [...prev.facilities, f]
    }));
  };

  // Menggunakan AnimatePresence untuk animasi keluar
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-emerald-800">
                  {isEditing ? "Edit Kamar" : "Tambah Kamar Baru"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Form Konten */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Grup Input Dasar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nama Kamar" 
                  icon={Bed} 
                  value={formData.name} 
                  onChange={v => handleChange('name', v)} 
                  required 
                />
                
                <Select 
                  label="Tipe" 
                  value={formData.type} 
                  onChange={v => handleChange('type', v)} // Gunakan handleChange
                  options={roomTypes} 
                />

                <Input 
                  label="Harga per Malam (Rp)" 
                  icon={DollarSign} 
                  type="number" 
                  name="price"
                  value={formData.price} 
                  onChange={v => handleChange('price', v)} 
                  placeholder="850000" 
                  required 
                />
                
                <Input 
                  label="Kapasitas Tamu" 
                  icon={Users} 
                  type="number" 
                  name="capacity"
                  value={formData.capacity} 
                  onChange={v => handleChange('capacity', v)} 
                  min="1" max="10" 
                  required 
                />
                
                <Input 
                  label="Ukuran (m²)" 
                  icon={Ruler} 
                  type="number" 
                  name="size"
                  value={formData.size} 
                  onChange={v => handleChange('size', v)} 
                  required 
                />
                
                <Input 
                  label="Tipe Tempat Tidur" 
                  icon={Bed} 
                  name="bed"
                  value={formData.bed} 
                  onChange={v => handleChange('bed', v)} 
                  placeholder="King Bed / 2 Single Beds" 
                  required 
                />
              </div>

              {/* URL Gambar - Dibuat visible untuk opsi kustomisasi */}
              <Input 
                label="URL Gambar Kamar" 
                icon={ImageIcon} 
                name="image"
                value={formData.image} 
                onChange={v => handleChange('image', v)} 
                placeholder="https://images.unsplash.com/photo-..." 
                required 
              />
              
              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-800"
                  placeholder="Berikan deskripsi singkat tentang kamar ini..."
                  required
                />
              </div>

              {/* Fasilitas Checkbox */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Fasilitas</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilitiesList.map(f => (
                    <label 
                      key={f} 
                      className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer 
                        ${formData.facilities.includes(f) 
                          ? 'bg-emerald-50 border-emerald-400' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(f)}
                        onChange={() => toggleFacility(f)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview Gambar */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Preview Gambar</p>
                <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={formData.image} 
                    alt="preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/CCCCCC/333333?text=Image+Not+Found"; }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs font-medium">{formData.image.length > 50 ? formData.image.substring(0, 50) + '...' : formData.image}</p>
                  </div>
                </div>
              </div>

              {/* Footer Aksi */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  {isEditing ? "Update Kamar" : "Simpan Kamar"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition shadow-md"
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

// --- Komponen Pembantu ---

const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />}
      <input
        id={props.name}
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-800 placeholder-gray-400 ${Icon ? 'pl-10' : ''}`}
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select
      id={props.name}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-gray-800 appearance-none bg-white pr-8"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);