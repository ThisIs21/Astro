import React, { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Data dummy sementara (nanti bisa fetch dari API)
    const data = [
      {
        id: 1,
        hotelName: "Deluxe Mountain View",
        image:
          "https://images.unsplash.com/photo-1549488344-99b9a6711516?auto=format&fit=crop&w=800&q=80",
        checkIn: "2025-11-02",
        checkOut: "2025-11-05",
        paymentStatus: "Paid",
      },
      {
        id: 2,
        hotelName: "Family Suite",
        image:
          "https://images.unsplash.com/photo-1582234057630-f8f8f26d60a5?auto=format&fit=crop&w=800&q=80",
        checkIn: "2025-12-10",
        checkOut: "2025-12-15",
        paymentStatus: "Pending",
      },
    ];
    setBookings(data);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
        Pemesanan Saya
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 italic">
          Anda belum memiliki pemesanan.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={booking.image}
                alt={booking.hotelName}
                className="h-52 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {booking.hotelName}
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Check-in:</span>{" "}
                    {booking.checkIn}
                  </p>
                  <p>
                    <span className="font-medium">Check-out:</span>{" "}
                    {booking.checkOut}
                  </p>
                  <p>
                    <span className="font-medium">Status Pembayaran:</span>{" "}
                    <span
                      className={`${
                        booking.paymentStatus === "Paid"
                          ? "text-green-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </p>
                </div>
                <button className="mt-5 w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition duration-200">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
