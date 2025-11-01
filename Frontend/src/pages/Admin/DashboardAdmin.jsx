import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // nanti bisa tambahkan decode JWT kalau mau ambil email dari token
    setAdminEmail("Admin");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-black">Selamat Datang, {adminEmail}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-400"
      >
        Logout
      </button>
    </div>
  );
}
