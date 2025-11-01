import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Transaction() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const room = state?.room;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!room) {
      navigate("/rooms"); // Kembali ke Rooms kalau tidak ada room
    }
  }, [room, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { check_in, check_out } = formData;
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      setMessage("Tanggal check-out harus lebih besar dari check-in.");
      return;
    }

    const total_price = room.price * nights;
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          room_id: room.ID,
          check_in: checkInDate.toISOString(),
          check_out: checkOutDate.toISOString(),
          total_price,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(result.error || "Terjadi kesalahan saat booking.");
        return;
      }
      setMessage("Booking berhasil dibuat!");
      setTimeout(() => {
        navigate("/rooms");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan saat booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!room) return null;

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-12">Transaksi</h2>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-auto p-6">
        <img
          src={room.image_url || "https://via.placeholder.com/400x250"}
          alt={room.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {room.description || "Lokasi strategis dekat pusat kota"}
        </p>
        <p className="text-yellow-500 font-bold mb-4">
          Rp {room.price.toLocaleString("id-ID")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Nama Pemesan"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Pemesan"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            type="text"
            name="phone"
            placeholder="Nomor Telepon"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Check-in
              </label>
              <input
                type="date"
                name="check_in"
                value={formData.check_in}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="w-1/2">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Check-out
              </label>
              <input
                type="date"
                name="check_out"
                value={formData.check_out}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                min={formData.check_in || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            {submitting ? "Memproses..." : "Konfirmasi Pesanan"}
          </button>

          {message && (
            <p
              className={`text-center mt-3 text-sm ${
                message.includes("berhasil") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}