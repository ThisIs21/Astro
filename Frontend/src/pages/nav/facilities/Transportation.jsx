import { useState, useEffect } from "react";

export default function Transportation() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavHeight(nav.offsetHeight);
  }, []);

  return (
    <div className="min-h-screen text-gray-900 bg-white">
      {/* HERO SECTION */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: `calc(120vh - ${navHeight}px)` }}
      >
        <img
          src="/img/transportation.jpg"
          alt="Transportation Service"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div
          className="relative z-20 text-center px-6 max-w-3xl flex flex-col items-center justify-center"
          style={{ minHeight: `calc(100vh - ${navHeight}px)` }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
            Transport <span className="text-yellow-500">Astro Highland</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
             Nisi cupiditate optio reiciendis id veniam deleniti reprehenderit hic nesciunt! Id perferendis non doloremque.
          </p>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Pilihan Layanan</h2>
          <p className="text-gray-700 leading-relaxed mb-10">
            Kami melayani penjemputan dan pengantaran dari beberapa titik utama:
          </p>
          <ul className="text-gray-800 text-left mx-auto inline-block space-y-3">
            <li>• Bandara Husein Sastranegara (Bandung)</li>
            <li>• Stasiun Bandung</li>
            <li>• Stasiun Padalarang</li>
            <li>• Terminal Leuwi Panjang</li>
            <li>• Area sekitar Lembang dan Bandung Utara</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-10">
            Kami menggunakan kendaraan bersih dan nyaman dengan pengemudi berpengalaman.
            Anda bisa memesan layanan ini bersamaan dengan pemesanan kamar
            atau secara terpisah melalui form di bawah.
          </p>
        </div>
      </section>
    </div>
  );
}
