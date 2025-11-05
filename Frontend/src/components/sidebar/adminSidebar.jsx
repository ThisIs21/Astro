import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaStar,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Reservasi", icon: <FaCalendarAlt />, path: "/admin/rooms" },
    { name: "Konten", icon: <FaFileAlt />, path: "/admin/content" },
    { name: "Pengguna", icon: <FaUsers />, path: "/admin/users" },
    { name: "Pengaturan", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white min-h-screen flex flex-col justify-between rounded-r-2xl shadow-lg"
    >
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-green-700">
          <div className="bg-amber-500 text-white p-2 rounded-lg text-lg font-bold">
            <FaStar />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Astro</h1>
            <p className="text-xs text-green-200">Admin Panel</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4">
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

      {/* Upgrade Pro */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-green-700 mx-4 mb-6 p-4 rounded-xl text-center"
      >
        <div className="flex items-center justify-center gap-2 text-amber-400 text-lg">
          <FaStar />
          <span className="font-semibold">Upgrade Pro</span>
        </div>
        <p className="text-green-200 text-xs mt-1">Fitur lebih lengkap</p>
      </motion.div>
    </motion.aside>
  );
}
