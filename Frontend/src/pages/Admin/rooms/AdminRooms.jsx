import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBed, FaDollarSign, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";

// Data kamar Admin (Diperbarui agar sesuai dengan format Admin)
const ADMIN_ROOMS_DATA = [
  {
    id: "R001",
    r_name: "Deluxe Room",
    r_type: "Deluxe",
    rp_weekday: 1500000,
    rp_weekend: 2000000,
    r_status: "Available", // Penting untuk Admin
    r_description: "Kamar mewah dengan fasilitas lengkap. Pemandangan kota.",
    r_facilities: ["WiFi", "TV", "Mini Bar"],
    r_images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&h=500&fit=crop", // Ganti dengan URL gambar asli
        "https://images.unsplash.com/photo-1549488344-99b9a6711516?q=80&w=800&h=500&fit=crop"
    ]
  },
  {
    id: "R002",
    r_name: "Executive Suite",
    r_type: "Suite",
    rp_weekday: 3500000,
    rp_weekend: 4200000,
    r_status: "Booked",
    r_description: "Suite premium dengan ruang tamu terpisah dan jacuzzi.",
    r_facilities: ["WiFi", "TV", "Mini Bar", "Jacuzzi"],
    r_images: [
        "https://images.unsplash.com/photo-1582234057630-f8f8f26d60a5?q=80&w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1570535973685-618413b91c12?q=80&w=800&h=500&fit=crop"
    ]
  }
];

// Helper Function untuk format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Rooms() {
  const navigate = useNavigate();
  // Menggunakan data dummy yang baru dan lebih lengkap
  const [rooms, setRooms] = useState(ADMIN_ROOMS_DATA); 

  // Fungsi aksi untuk Admin
  const handleDelete = (roomId) => {
      if (window.confirm(`Yakin ingin menghapus Kamar ID: ${roomId}?`)) {
          // Logika Hapus: Kirim request DELETE ke API
          console.log(`[ADMIN ACTION] Menghapus kamar ${roomId}`);
          // Update state setelah berhasil dihapus
          setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
      }
  };

  return (
    // Layout Admin: Background putih/abu-abu agar lebih fokus ke konten
    <div className="min-h-screen bg-gray-100 p-8"> 
      
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Manajemen Kamar Hotel 🏨
        </h1>

        {/* Tombol Tambah Kamar Baru */}
        <div className="flex justify-end mb-6">
          <Link 
            to="/admin/rooms/create" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-lg flex items-center space-x-2"
          >
            <FaBed />
            <span>Tambah Kamar Baru</span>
          </Link>
        </div>

        {/* Daftar Kamar dalam Card Layout */}
        <div className="space-y-6">
          {rooms.length === 0 ? (
            <p className="text-center text-lg text-gray-600 p-8 bg-white rounded-lg shadow">
              Belum ada data kamar. Silakan tambahkan kamar baru.
            </p>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                // Card Layout Mirip User View, tapi dengan warna & shadow berbeda untuk Admin
                className="flex flex-col md:flex-row bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition duration-300"
              >
                
                {/* Bagian Kiri: Gambar dan Status */}
                <div className="w-full md:w-1/4 relative h-64 md:h-auto">
                    {/* Gambar Pertama sebagai Thumbnail */}
                    <img
                        src={room.r_images[0] || "https://via.placeholder.com/600x400?text=No+Image"}
                        alt={room.r_name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/600x400?text=No+Image")}
                    />
                    
                    {/* Badge Status Admin */}
                    <div 
                        className={`absolute top-0 right-0 m-3 px-3 py-1 text-xs font-bold rounded-full 
                            ${room.r_status === "Available" ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`
                        }
                    >
                        <div className="flex items-center space-x-1">
                            {room.r_status === "Available" ? <FaCheckCircle /> : <FaTimesCircle />}
                            <span>{room.r_status}</span>
                        </div>
                    </div>
                </div>

                {/* Bagian Tengah: Detail Kamar dan Harga */}
                <div className="w-full md:w-2/4 p-6 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase text-gray-500">
                            ID: {room.id}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                            {room.r_name} ({room.r_type})
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {room.r_description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center text-sm text-gray-700 space-x-4 border-t pt-4">
                        <div className="flex items-center space-x-1">
                            <FaDollarSign className="text-base text-green-600" />
                            <span>**Weekday:** {formatRupiah(room.rp_weekday)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaDollarSign className="text-base text-red-600" />
                            <span>**Weekend:** {formatRupiah(room.rp_weekend)}</span>
                        </div>
                    </div>
                </div>

                {/* Bagian Kanan: Aksi Admin */}
                <div className="w-full md:w-1/4 p-6 bg-gray-50 flex flex-col space-y-3 justify-center">
                    <Link
                        to={`/admin/rooms/edit/${room.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center flex items-center justify-center space-x-2"
                    >
                        <FaEdit />
                        <span>Edit Detail</span>
                    </Link>
                    <button
                        onClick={() => handleDelete(room.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center flex items-center justify-center space-x-2"
                    >
                        <FaTrash />
                        <span>Hapus Kamar</span>
                    </button>
                    <button
                        onClick={() => navigate(`/admin/rooms/view/${room.id}`)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 text-center flex items-center justify-center space-x-2"
                    >
                        <FaEye />
                        <span>Lihat Penuh</span>
                    </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}