import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Users, Bed, Hash } from "lucide-react";

// Dihapus karena Type dan Facilities sekarang menggunakan Input Text
// const roomTypes = ["Glamping", "Villa", "Cottage", "Cabin"];
// const facilitiesList = ["AC", "WiFi", "Private Bathroom", "Kitchen", "Bathtub", "Balcony", "TV", "Fireplace", "Hot Tub"];

// Komponen Input dan Select dipindahkan ke bawah agar kode utama lebih bersih
// Komponen Select sudah Dihapus karena tidak terpakai

export default function RoomFormModal({ isOpen, onClose, onSave, initialData }) {
const [formData, setFormData] = useState({
 name: "", 
   type: "Glamping", // Type masih default, tapi akan diisi dari Input Text
   price: "", 
   capacity: 2, 
   bed: "", 
   description: "",
 // [PERUBAHAN] State untuk gambar diubah menjadi array untuk multi-file
 imagesPreview: [], 
 imagesFiles: [], 
 room_number: "", 
   category: "",
 // [PERUBAHAN KRUSIAL] State fasilitas diubah menjadi string (untuk Input Text)
 facilitiesString: "", 
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
  
  // [PERUBAHAN KRUSIAL] Konversi Array Fasilitas lama menjadi String (dipisahkan koma)
  facilitiesString: Array.isArray(initialData.facilities) ? initialData.facilities.join(', ') : "",
  
  // Setup untuk multi-image
  imagesPreview: Array.isArray(initialData.image) ? initialData.image : (initialData.image ? [initialData.image] : []),
  imagesFiles: [], // File baru selalu kosong saat awal edit
  room_number: initialData.room_number || "",
  category: initialData.category || ""
 });
 } else {
 setFormData({
  name: "", type: "Glamping", price: "", capacity: 2, bed: "", description: "",
  facilitiesString: "", // <-- State awal untuk string fasilitas
  imagesPreview: [], imagesFiles: [], 
  room_number: "", category: ""
 });
 }
}, [initialData]);

const handleChange = (name, value) => {
 setFormData(prev => ({ ...prev, [name]: value }));
};

// Handle perubahan input multiple files
const handleImagesChange = (fileList) => {
 const newFiles = Array.from(fileList);
 
 const previews = newFiles.map(file => URL.createObjectURL(file));

 setFormData(prev => ({
 ...prev,
 imagesPreview: previews, // Hanya tampilkan preview file BARU
 imagesFiles: newFiles // Simpan objek File yang akan dikirim
 }));
};

// Fungsi handleSubmit dimodifikasi untuk membuat FormData
const handleSubmit = (e) => {
 e.preventDefault();
 
 // [LOGIC BARU] Proses facilitiesString menjadi Array
 const processedFacilities = formData.facilitiesString
  .split(',')
  .map(f => f.trim()) // Hapus spasi di awal/akhir
  .filter(f => f !== ''); // Hapus string kosong

 // Membuat FormData object
 const dataToSend = new FormData();
 
 // Append fields text sesuai dengan key di Postman (case-sensitive)
 dataToSend.append("name", formData.name);
 dataToSend.append("description", formData.description);
 dataToSend.append("room_number", formData.room_number || "");
 dataToSend.append("price", formData.price); 
 dataToSend.append("type", formData.type); // Value diambil dari Input Text
 dataToSend.append("capacity", formData.capacity);
 dataToSend.append("bed_type", formData.bed);
 dataToSend.append("category", formData.category || "");

 // [KRUSIAL] Append array facilities. Go (Gin) menggunakan PostFormArray
 processedFacilities.forEach(f => dataToSend.append("facilities", f)); 

 // Append file images. 
 if (formData.imagesFiles.length > 0) {
 // Kirim semua file yang baru dipilih
 formData.imagesFiles.forEach(file => {
  dataToSend.append("images", file); // Key harus "images"
 });
 } else if (isEditing && formData.imagesPreview.length > 0) {
 // Jika edit dan tidak ada file baru, kirim path gambar lama (URL)
 formData.imagesPreview.forEach(path => {
      dataToSend.append("images", path); 
   });
 } else if (!isEditing) {
    alert("Minimal upload 1 gambar!");
    return;
  }

 // Panggil onSave dengan objek FormData
 onSave(dataToSend); 
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
   {/* Header */}
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
    
    {/* [MODIFIKASI] Tipe Kamar menggunakan Input Text */}
    <Input label="Tipe Kamar" value={formData.type} onChange={v => handleChange('type', v)} placeholder="Glamping, Villa, dll." required />
    
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
    multiple // Mengizinkan multiple files
    onChange={(e) => handleImagesChange(e.target.files)}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
    />
    
    {/* Menampilkan preview semua gambar */}
    {formData.imagesPreview.length > 0 && (
    <div className="mt-3 grid grid-cols-3 gap-2">
            {formData.imagesPreview.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`preview ${index}`} 
                className="h-24 object-cover rounded-lg" 
              />
            ))}
          </div>
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
    {/* [MODIFIKASI] Fasilitas menggunakan Input Text tunggal */}
    <Input 
            label="Fasilitas (Pisahkan dengan koma)" 
            value={formData.facilitiesString} 
            onChange={v => handleChange('facilitiesString', v)} 
            placeholder="AC, WiFi, TV, Kitchen" 
        />
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
    className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 outline-none ${Icon ? 'pl-10' : ''} text-black`}
    {...props}
    onChange={(e) => props.onChange(e.target.value)}
   />
  </div>
 </div>
);

// Catatan: Komponen Select dihapus karena sudah tidak terpakai.