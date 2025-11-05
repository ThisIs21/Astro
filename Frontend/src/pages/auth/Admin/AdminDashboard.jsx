import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  User,
  Plus,
  FileText,
  Mail,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Reservasi",
      value: 156,
      change: "+12% dari bulan lalu",
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Pengunjung Hari Ini",
      value: 24,
      change: "+8% dari bulan lalu",
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Pendapatan Bulan Ini",
      value: "Rp 45.2M",
      change: "+15% dari bulan lalu",
      icon: <DollarSign className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Rating Rata-rata",
      value: 4.8,
      change: "+0.2 dari bulan lalu",
      icon: <Star className="w-6 h-6 text-purple-500" />,
    },
  ];

  const latestReservations = [
    {
      name: "Budi Santoso",
      type: "Glamping Premium",
      date: "2024-01-15",
      amount: "Rp 850.000",
      status: "Dikonfirmasi",
    },
    {
      name: "Sari Dewi",
      type: "Restoran Alam",
      date: "2024-01-14",
      amount: "Rp 320.000",
      status: "Menunggu",
    },
    {
      name: "Ahmad Rizki",
      type: "Paket Aktivitas",
      date: "2024-01-13",
      amount: "Rp 450.000",
      status: "Dikonfirmasi",
    },
  ];

  const quickActions = [
    {
      title: "Tambah Reservasi",
      icon: <Plus className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Buat Konten",
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50 hover:bg-orange-100",
    },
    {
      title: "Kirim Notifikasi",
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Lihat Laporan",
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  return (
    <motion.div
      className="p-8 w-full bg-gradient-to-br from-green-50 to-amber-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-green-600 to-amber-500 p-6 rounded-2xl shadow-lg text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Selamat Datang di Dashboard Astro!
            </h1>
            <p className="text-sm text-green-100">
              Kelola destinasi wisata alam terbaik di Ciater, Subang
            </p>
          </div>
          <motion.img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=120&h=80&fit=crop"
            alt="Nature"
            className="rounded-xl w-28 h-20 object-cover border border-white/40 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Statistik */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition-all border border-gray-100"
            whileHover={{ scale: 1.03 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              {item.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            <p className="text-xs text-green-500">{item.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservasi Terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Reservasi Terbaru
            </h2>
            <button className="text-green-600 text-sm hover:text-green-700">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {latestReservations.map((r, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.type}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{r.amount}</p>
                  <p
                    className={`text-xs font-medium ${
                      r.status === "Dikonfirmasi"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {r.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Aksi Cepat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((a, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`${a.bg} flex flex-col items-center justify-center py-5 rounded-xl shadow-sm border border-gray-100 transition`}
              >
                {a.icon}
                <p className="mt-2 text-sm font-medium text-gray-700">{a.title}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
