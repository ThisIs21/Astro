import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaBed, FaDollarSign, FaSortNumericUpAlt, FaImage } from "react-icons/fa";
import axios from 'axios'; // Pastikan Anda sudah menginstal axios

const AdminRoomsAdd = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref untuk akses input file

  const [formData, setFormData] = useState({
    r_name: "",
    r_type: "",
    r_count: 1, 
    r_unit: "per malam", 
    rp_weekday: 0,
    rp_weekend: 0,
    r_status: "Available", 
    r_description: "",
    r_facilities: [],
    // r_images akan dikirimkan sebagai Files terpisah dalam FormData
  });
  
  // State BARU untuk menampung file-file yang dipilih (bukan URL lagi)
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [newFacility, setNewFacility] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- HANDLERS UTAMA ---
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  // --- HANDLERS FILE UPLOAD ---
  const handleFileChange = (e) => {
    // Mengambil semua file dari input
    const files = Array.from(e.target.files); 
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    
    // Reset input agar bisa memilih file yang sama lagi
    e.target.value = null; 
  };

  const removeFile = (fileName) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  // --- HANDLERS ARRAY (Fasilitas) ---
  const addFacility = () => {
    if (newFacility.trim() !== '' && !formData.r_facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        r_facilities: [...prev.r_facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const removeFacility = (facilityToRemove) => {
    setFormData(prev => ({
      ...prev,
      r_facilities: prev.r_facilities.filter(f => f !== facilityToRemove)
    }));
  };
  
  // --- HANDLER SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi
    if (!formData.r_name || formData.r_count <= 0 || formData.rp_weekday <= 0) {
        setError("Nama Kamar, Jumlah Kamar, dan Harga Weekday harus diisi dengan benar.");
        setLoading(false);
        return;
    }

    try {
      const API_URL = 'http://localhost:5000/api/rooms';
      
      // 1. Buat Objek FormData baru
      const dataToSend = new FormData();
      
      // 2. Tambahkan semua field data teks ke FormData
      // Mengubah array fasilitas menjadi string JSON agar dapat dikirim
      const payload = {
        ...formData,
        r_facilities: JSON.stringify(formData.r_facilities)
      };
      
      Object.keys(payload).forEach(key => {
        dataToSend.append(key, payload[key]);
      });
      
      // 3. Tambahkan file gambar ke FormData
      selectedFiles.forEach((file ) => {
        // 'r_images' harus sesuai dengan field di backend (Multer)
        dataToSend.append('r_images', file); 
      });

      // 4. Kirim data
      // Penting: Jangan set Content-Type, biarkan browser yang menanganinya (multipart/form-data)
      const response = await axios.post(API_URL, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }
      });
      
      console.log("Data Kamar berhasil ditambahkan:", response.data); 

      alert("Kamar berhasil ditambahkan!");
      navigate('/admin/rooms'); 

    } catch (err) {
      console.error("Gagal menambahkan kamar:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  // --- TAMPILAN JSX ---
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-t-4 border-indigo-600">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center space-x-3">
          <FaBed className="text-indigo-600" />
          <span>Tambah Tipe Kamar Baru</span>
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* BAGIAN 1 & 2 (DETAIL & HARGA): Tetap Sama */}
          {/* ... (Detail Kamar dan Harga sama seperti kode sebelumnya) ... */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 md:col-span-3 mb-2">Informasi Tipe Kamar</h2>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kamar*</label>
              <input type="text" name="r_name" value={formData.r_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black" required />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kamar*</label>
              <input type="text" name="r_type" value={formData.r_type} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black" placeholder="Ex: Deluxe, Suite" required />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kamar (Unit)*</label>
              <div className="relative">
                <FaSortNumericUpAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" name="r_count" value={formData.r_count} onChange={handleChange} className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black" min="1" required />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Kamar*</label>
              <select name="r_status" value={formData.r_status} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black">
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kamar</label>
              <textarea name="r_description" value={formData.r_description} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black"/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 md:col-span-3 mb-2">Informasi Harga</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Weekday (Rp)*</label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" name="rp_weekday" value={formData.rp_weekday} onChange={handleChange} className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black" min="0" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Weekend (Rp)*</label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" name="rp_weekend" value={formData.rp_weekend} onChange={handleChange} className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black" min="0" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Harga*</label>
              <select name="r_unit" value={formData.r_unit} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black">
                <option value="per malam">per malam</option>
                <option value="per hari">per hari</option>
                <option value="per jam">per jam</option>
              </select>
            </div>
          </div>
          
          <div className="border p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fasilitas Kamar</h2>
            <div className="flex space-x-2 mb-4">
              <input type="text" value={newFacility} onChange={(e) => setNewFacility(e.target.value)} className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition text-black" placeholder="Contoh: AC, Kolam Renang, Sarapan"/>
              <button type="button" onClick={addFacility} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
                <FaPlus />
                <span>Tambah</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.r_facilities.map((facility, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full cursor-pointer hover:bg-indigo-200 transition" onClick={() => removeFacility(facility)}>
                  {facility}
                  <FaTimes className="ml-2 h-3 w-3 text-indigo-600" />
                </span>
              ))}
            </div>
          </div>


          {/* BAGIAN BARU: FILE UPLOAD LOKAL */}
          <div className="border p-6 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaImage className="text-indigo-600"/> 
                <span>Upload Gambar Kamar (Lokal)</span>
            </h2>
            <div className="flex space-x-2 mb-4">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" // Sembunyikan input file bawaan
                    multiple // Mengizinkan banyak file
                    accept="image/*" // Hanya menerima file gambar
                />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 transition duration-200"
                >
                    <FaPlus />
                    <span>Pilih Foto dari Komputer</span>
                </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <div key={file.name} className="relative group p-2 border border-gray-300 rounded-lg shadow-md flex items-center space-x-2 bg-white">
                    <FaImage className="text-indigo-500 h-5 w-5" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button 
                        type="button" 
                        onClick={() => removeFile(file.name)} 
                        className="text-red-500 hover:text-red-700 transition"
                    >
                        <FaTimes className="h-4 w-4" />
                    </button>
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN 5: ACTION BUTTONS */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/rooms')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center space-x-2"
              disabled={loading}
            >
              <FaTimes />
              <span>Batal</span>
            </button>

            <button
              type="submit"
              className={`py-3 px-6 rounded-lg font-bold transition duration-200 flex items-center space-x-2 ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              }`}
              disabled={loading}
            >
              <FaSave />
              <span>{loading ? 'Menyimpan...' : 'Simpan Kamar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRoomsAdd;