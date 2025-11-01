import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaBed,
  FaTv,
  FaWifi,
  FaShower,
  FaUtensils,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- DATA DUMMY UNTUK AWALAN ---
const DUMMY_ROOMS = [
  {
    id: 1,
    name: "Deluxe Mountain View",
    description:
      "Kamar yang nyaman dengan balkon pribadi menghadap langsung ke pegunungan. Cocok untuk pasangan yang mencari ketenangan. Dilengkapi kamar mandi modern dengan pancuran air panas.",
    images: [
      "https://images.unsplash.com/photo-1549488344-99b9a6711516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    facilities: ["Bed", "TV", "WiFi", "Shower", "Breakfast"],
    priceWeekday: 850000,
    priceWeekend: 1100000,
  },
  {
    id: 2,
    name: "Family Suite",
    description:
      "Suite luas dengan dua kamar tidur terpisah, ideal untuk keluarga. Ruang tamu lengkap dan pemandangan hutan. Dapat menampung hingga 4 orang dewasa.",
    images: [
      "https://images.unsplash.com/photo-1582234057630-f8f8f26d60a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570535973685-618413b91c12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    facilities: ["Bed", "TV", "WiFi", "Shower", "Breakfast", "Utensils"],
    priceWeekday: 1500000,
    priceWeekend: 1950000,
  },
  {
    id: 3,
    name: "Luxury Private Villa",
    description:
      "Vila pribadi eksklusif dengan kolam renang mini, dapur, dan layanan butler pribadi. Privasi dan kemewahan maksimal di tengah alam.",
    images: [
      "https://images.unsplash.com/photo-1582233470984-b05442578c77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542382025-b072c4481514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    facilities: [
      "Bed",
      "TV",
      "WiFi",
      "Shower",
      "Breakfast",
      "Utensils",
      "Pool",
    ],
    priceWeekday: 3200000,
    priceWeekend: 4000000,
  },
];
// --- AKHIR DATA DUMMY ---

export default function Rooms() {
  const navigate = useNavigate(); // di dalam komponen Rooms
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    rooms: 1,
    adults: 1,
    children: 0,
  });
  const [availableRooms, setAvailableRooms] = useState(DUMMY_ROOMS);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = checkOutDate - checkInDate;
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const checkAvailability = async () => {
    const nights = calculateNights();
    if (nights <= 0) {
      setError("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }

    setTimeout(() => {
      const filteredRooms = DUMMY_ROOMS.filter((room) => {
        if (formData.adults > 2 && room.id === 1) return false;
        return true;
      });
      setAvailableRooms(filteredRooms);
      setError(
        filteredRooms.length === 0
          ? "Maaf, tidak ada kamar tersedia untuk kriteria Anda."
          : null
      );
    }, 500);
  };

  const handleQuickView = (room) => {
    setSelectedRoom(room);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const iconMap = {
    Bed: <FaBed className="text-xl text-gray-800" />,
    TV: <FaTv className="text-xl text-gray-800" />,
    WiFi: <FaWifi className="text-xl text-gray-800" />,
    Shower: <FaShower className="text-xl text-gray-800" />,
    Breakfast: <FaUtensils className="text-xl text-gray-800" />,
    Pool: <FaShower className="text-xl text-gray-800" />,
  };

  const FacilityTooltip = ({ name }) => {
    return (
      <div className="flex items-center space-x-2 mr-4 mb-2">
        {iconMap[name] || <FaBed className="text-xl text-gray-800" />}
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
        Jelajahi Kamar Elegan Kami
      </h1>

      {/* Form Pencarian */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto mb-10 border-t-4 border-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Cek Ketersediaan
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAvailability();
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent transition duration-200 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent transition duration-200 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kamar
              </label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent transition duration-200 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dewasa
              </label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent transition duration-200 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anak
              </label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent transition duration-200 text-gray-900"
              />
            </div>

            {/* Tombol Pencarian dengan Jumlah Malam Otomatis */}
            <button
              type="submit"
              // Menggunakan py-2 dan px-4 (ukuran kecil) sesuai permintaan
              className="w-full md:w-auto col-span-2 md:col-span-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-1 px-4
    rounded-lg shadow-md transition duration-200 flex flex-col items-center justify-center text-sm"
            >
              {/* Teks utama tombol */}
              Cari Kamar
              {/* Menampilkan jumlah malam secara otomatis */}
              <span className="text-xs font-normal opacity-90 mt-0.5">
                ({calculateNights()} Malam)
              </span>
            </button>
          </div>
        </form>
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
      <p className="max-w-6xl mx-auto text-sm text-gray-600 mb-8 text-center italic">
        *Harga dan ketersediaan di bawah adalah estimasi. Gunakan form di atas
        untuk detail aktual.
      </p>

      {/* Daftar Kamar Tersedia dalam Row Layout */}
      <div className="max-w-6xl mx-auto">
        {availableRooms.length === 0 ? (
          <p className="text-center text-lg text-gray-700">
            Tidak ada kamar yang sesuai dengan kriteria Anda saat ini.
          </p>
        ) : (
          availableRooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-xl mb-8 overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <div className="w-full md:w-1/3 h-64 relative">
                <Slider {...sliderSettings}>
                  {room.images.map((img, i) => (
                    <div key={i} className="h-64">
                      <img
                        src={img}
                        alt={`${room.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/600x400?text=Image+Not+Found")
                        }
                      />
                    </div>
                  ))}
                </Slider>
                <button
                  onClick={() => handleQuickView(room)}
                  className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition duration-200"
                >
                  <FaEye className="text-lg" />
                </button>
              </div>
              <div className="w-full md:w-2/3 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {room.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>
                <div className="flex flex-wrap border-t border-gray-200 pt-3 mb-4">
                  {room.facilities.map((facility, i) => (
                    <FacilityTooltip key={i} name={facility} />
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <div>
                    <span className="text-lg font-semibold text-gray-800">
                      Rp {room.priceWeekday.toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-gray-500 block">
                      / malam (Weekday)
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-5 rounded-lg transition duration-200"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick View Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-5xl relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 bg-white rounded-full p-2 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative">
                <Slider {...sliderSettings}>
                  {selectedRoom.images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={img}
                        alt={`${selectedRoom.name} ${i + 1}`}
                        className="w-full h-80 object-cover rounded-lg"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/800x600?text=Image+Not+Found")
                        }
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                  {selectedRoom.name}
                </h2>
                <p className="text-gray-700 text-sm mb-4 border-b pb-4">
                  {selectedRoom.description}
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Fasilitas:
                  </h3>
                  <div className="flex flex-wrap">
                    {selectedRoom.facilities.map((facility, i) => (
                      <FacilityTooltip key={i} name={facility} />
                    ))}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-xl text-gray-800">
                    Estimasi Harga:
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Periode: {formData.checkIn || "Belum dipilih"} -{" "}
                    {formData.checkOut || "Belum dipilih"} ({calculateNights()}{" "}
                    malam)
                  </p>
                  <p className="text-sm text-gray-600">
                    Weekday: Rp{" "}
                    {selectedRoom.priceWeekday.toLocaleString("id-ID")} / malam
                  </p>
                  <p className="text-sm text-gray-600">
                    Weekend: Rp{" "}
                    {selectedRoom.priceWeekend.toLocaleString("id-ID")} / malam
                  </p>
                  <p className="font-bold text-lg mt-3 text-gray-900">
                    Total Estimasi: Rp{" "}
                    {(calculateNights() > 0
                      ? calculateNights() * selectedRoom.priceWeekday
                      : "---"
                    ).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    *Harga final dihitung saat checkout
                  </p>
                </div>
                <Link
                  to={`/booking/${selectedRoom.id}`}
                  onClick={() => setSelectedRoom(null)}
                  className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-center block transition duration-200"
                >
                  Lanjutkan Pemesanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
