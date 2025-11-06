import React, { useState } from "react";
import { motion } from "framer-motion";
// PERBAIKAN: Mengganti react-icons/ri dengan lucide-react karena error resolusi
import { Eye, EyeOff, Leaf, CheckCircle, AlertTriangle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

// URL dasar untuk backend Go Anda
const API_BASE_URL = "http://localhost:8080"; 

const LoginPage = () => {
  // State untuk form
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk pesan kustom (menggantikan alert)
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [showMessageBox, setShowMessageBox] = useState(false);
  
  const navigate = useNavigate();

  const showCustomMessage = (type, text) => {
    setMessage({ type, text });
    setShowMessageBox(true);
    // Secara otomatis menyembunyikan pesan setelah 5 detik
    setTimeout(() => setShowMessageBox(false), 5000);
  };

  const handleLogin = async (e) => { // Ditambahkan 'async'
    e.preventDefault();
    setLoading(true);
    setShowMessageBox(false);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/login/do-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Penting: Tambahkan header CORS atau kredensial jika perlu
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login Sukses (Status 200)
        // Note: Dalam aplikasi nyata, 'token' harus menjadi bagian dari respons
        const token = data.user.token || "default-secure-token"; // Ganti dengan logika token asli dari Go
        localStorage.setItem("adminToken", token); 
        
        showCustomMessage("success", "Login berhasil! Mengalihkan ke Dashboard Admin.");

        // Navigasi setelah penundaan sebentar
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);

      } else {
        // Login Gagal (Status 401 atau 400)
        const errorText = data.error || "Terjadi kesalahan saat login.";
        
        // Cek jika error 401 dari Gin, kemungkinan menampilkan pesan dari h.service.Login
        showCustomMessage("error", errorText);
      }
    } catch (error) {
      // Kesalahan jaringan atau server tidak terjangkau
      console.error("Error during fetch:", error);
      showCustomMessage(
        "error", 
        <>
          Gagal terhubung ke server Go. Pastikan backend berjalan di 
          <strong className="block mt-1">
             {API_BASE_URL}
          </strong>
        </>
      );
    } finally {
      setLoading(false);
    }
  };

  const MessageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.8, y: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Kebun Teh */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          // Gambar disederhanakan agar lebih cepat dimuat, tetapi resolusi tetap tinggi
          backgroundImage: `url('https://images.unsplash.com/photo-1464207687429-7505649dae38?w=2400&q=80')`, 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-amber-900/60" />
      </div>

      {/* Message Box / Modal (Menggantikan alert) */}
      {showMessageBox && message && (
        <motion.div
          variants={MessageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-sm w-full transition-colors duration-300 ${
            message.type === "success"
              ? "bg-green-600/90 border-green-400"
              : "bg-red-600/90 border-red-400"
          } text-white border-2`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {/* PERBAIKAN: Menggunakan CheckCircle dari Lucide */}
              {message.type === "success" ? (
                <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
              ) : (
                // PERBAIKAN: Menggunakan AlertTriangle dari Lucide
                <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
              )}
              <div className="text-sm font-Inter">
                {message.text}
              </div>
            </div>
            <button
              onClick={() => setShowMessageBox(false)}
              className="text-white/80 hover:text-white ml-4 flex-shrink-0"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}


      {/* Card Login */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-3"
            >
              {/* PERBAIKAN: Menggunakan Leaf dari Lucide */}
              <Leaf className="w-12 h-12 text-amber-400" />
              {/* Catatan: Font 'Pacifico' mungkin perlu diimpor jika tidak ada */}
              <h1 className="text-4xl font-extrabold text-white">Astro</h1>
            </motion.div>
            <p className="text-amber-100 mt-2 font-inter">Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-white/90 font-inter text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 transition"
                placeholder="Masukkan email Anda"
                disabled={loading}
              />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <label className="block text-white/90 font-inter text-sm mb-2">Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 transition pr-12"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-10 text-white/70 hover:text-amber-300"
                disabled={loading}
              >
                {/* PERBAIKAN: Menggunakan EyeOff/Eye dari Lucide */}
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-between text-sm"
            >
              <label className="flex items-center text-white/80">
                <input type="checkbox" className="mr-2 rounded accent-amber-400" />
                <span className="font-inter">Remember me</span>
              </label>
              <a href="#" className="text-amber-300 hover:text-amber-100 font-inter">
                Forgot password?
              </a>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-400/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Masuk ke Dashboard"
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/70 text-xs mt-6 font-inter">
            © 2025 Astro Ciater • Eco-Luxury Glamping
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;