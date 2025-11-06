// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar/adminSidebar";

import AdminLogin from "./pages/auth/login/Login";
import AdminDashboard from "./pages/auth/Admin/AdminDashboard";
import AdminRooms from "./pages/auth/Admin/rooms/AdminRooms";
import AdminRoomCard from "./pages/auth/Admin/rooms/RoomCard";
import RoomDetailModal from "./pages/auth/Admin/rooms/RoomDetailModal";
import AdminRoomForm from "./pages/auth/Admin/rooms/RoomFormModal";

import HomePage from "./pages/HomePage";
import Rooms from "./pages/nav/Room/Rooms";
import MyBookings from "./pages/nav/MyBookings";
import SwimmingPool from "./pages/nav/facilities/SwimmingPool";
import FitnessCentre from "./pages/nav/facilities/FitnessCentre";
import AdventurePark from "./pages/nav/facilities/AdventurePark";
import Transportation from "./pages/nav/facilities/Transportation";

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 flex">
    <Sidebar />
    <div className="flex-1 p-8 bg-white">{children}</div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin"); // HANYA INI YANG DIPAKAI

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* HIDE NAVBAR & FOOTER DI SEMUA HALAMAN ADMIN */}
      {!isAdmin && <Navbar />}

      <Routes>
        {/* LOGIN (TANPA SIDEBAR) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* SEMUA HALAMAN ADMIN → PAKAI SIDEBAR */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout><AdminRooms /></AdminLayout>} />
        <Route path="/admin/rooms/cards" element={<AdminLayout><AdminRoomCard /></AdminLayout>} />
        <Route path="/admin/rooms/cards/detail" element={<AdminLayout><RoomDetailModal /></AdminLayout>} />
        <Route path="/admin/rooms/new" element={<AdminLayout><AdminRoomForm /></AdminLayout>} />

        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/facilities/swimming-pools" element={<SwimmingPool />} />
        <Route path="/facilities/fitness-centre" element={<FitnessCentre />} />
        <Route path="/facilities/adventure-park" element={<AdventurePark />} />
        <Route path="/facilities/transportation" element={<Transportation />} />
      </Routes>

      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}