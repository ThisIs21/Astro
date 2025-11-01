import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  // state untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1. Saat halaman dibuka, cek apakah session (token) masih ada
  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    // kalau ada token & belum 24 jam
    if (token && loginTime && Date.now() - loginTime < 24 * 60 * 60 * 1000) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // 2. Fungsi login
  const handleLogin = async (e) => {
    e.preventDefault(); // biar tidak reload halaman

    try {
      const res = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      // simpan token & waktu login ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now().toString());

      // redirect ke dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Terjadi kesalahan server. Cek konsol untuk detail.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-yellow-400 shadow-lg p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4 border-black text-black"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-6 border-black text-black"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
