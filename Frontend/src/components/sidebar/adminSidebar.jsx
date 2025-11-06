// adminSidebar.jsx (Sudah Diperbaiki)
import { motion } from "framer-motion";
import { LogOut } from "lucide-react"; // Import ikon Logout
import { FaHotel } from "react-icons/fa"; // Mengganti FaStar dengan FaHotel untuk logo
// Import ikon Lucide yang baru
import { Bed, CalendarClock, LayoutDashboard, FileText, Users, Settings } from "lucide-react"; 
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin/dashboard" },
    { name: "Rooms", icon: <Bed className="w-5 h-5" />, path: "/admin/rooms" },
    { name: "Reservasi", icon: <CalendarClock className="w-5 h-5" />, path: "/admin/bookings" },
    { name: "Konten", icon: <FileText className="w-5 h-5" />, path: "/admin/content" },
    { name: "Pengguna", icon: <Users className="w-5 h-5" />, path: "/admin/users" },
    { name: "Pengaturan", icon: <Settings className="w-5 h-5" />, path: "/admin/settings" },
  ];

  // Fungsi placeholder untuk Logout. Anda perlu mengimplementasikan logika sebenarnya.
  const handleLogout = () => {
    console.log("Logout diklik. Implementasikan fungsi logout di sini!");
    // Contoh: hapus token, redirect ke halaman login
    // navigate('/login'); 
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      // Perbaikan: Mengganti min-h-screen dengan h-screen untuk tinggi tetap
      // Menambahkan flex-shrink-0 agar sidebar tidak mengecil
      className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen flex flex-col justify-between rounded-r-2xl shadow-lg flex-shrink-0 sticky top-0"
    >
      <div className="flex flex-col flex-grow overflow-y-auto"> {/* Kontainer untuk Logo dan Menu Utama */}
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-green-700">
          <div className="bg-amber-500 text-white p-2 rounded-lg text-lg font-bold">
            <FaHotel /> {/* Menggunakan ikon Hotel */}
          </div>
          <div>
            <h1 className="text-lg font-semibold">Astro</h1>
            <p className="text-xs text-green-200">Admin Panel</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="mt-4 pb-4">
          {menuItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 shadow-md"
                    : "text-green-100 hover:bg-green-700 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tombol Logout (Menggantikan Upgrade Pro) */}
      {/* Tombol ini akan menempel di bagian bawah sidebar */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-md"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}