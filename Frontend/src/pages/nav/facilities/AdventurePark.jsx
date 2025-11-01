import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AdventurePark() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavHeight(nav.offsetHeight);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  const images = [
    "/img/out1.jpg",
    "/img/out2.jpg",
  ];

  return (
    <div className="min-h-screen text-gray-900 bg-white">
      {/* HERO SECTION */}
      <section
        className="relative w-full flex items-center justify-center overflow-hidden bg-white"
        style={{ minHeight: `calc(120vh - ${navHeight}px)` }}
      >
        <div className="absolute inset-0 w-full h-full z-0">
          <Slider {...sliderSettings}>
            {images.map((src, index) => (
              <div
                key={index}
                className="relative w-full h-[100vh] bg-gray-200 flex items-center justify-center"
              >
                <img
                  src={src}
                  alt={`Adventure ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/1920x1080?text=Image+Not+Found";
                  }}
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </Slider>
        </div>

        <div
          className="relative z-20 text-center px-6 max-w-3xl flex flex-col items-center justify-center"
          style={{ minHeight: `calc(100vh - ${navHeight}px)` }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
            Adventure Park <span className="text-yellow-500">Astro Highland</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
            Nikmati serunya petualangan alam, eksplorasi outdoor, dan aktivitas seru bersama keluarga.
          </p>
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 space-y-24">
          {/* 1. Feeding Animals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="/img/feed1.jpg"
                alt="Feeding Animals"
                className="rounded-lg w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-4">Memberi Makan Hewan</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Rasakan pengalaman seru memberi makan kelinci, domba, dan rusa secara langsung.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Aktivitas ini sangat disukai anak-anak karena mereka bisa belajar tentang hewan dengan cara menyenangkan.
              </p>
              <a
                href="/contact"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Try It Now
              </a>
            </div>
          </div>

          {/* 2. Playground */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-4">Playground Outdoor</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Area bermain luas dengan wahana ayunan, seluncuran, dan trampolin aman untuk anak-anak.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Dirancang agar anak bisa bebas bergerak, bersenang-senang, dan berinteraksi dengan alam.
              </p>
              <a
                href="/contact"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Try It Now
              </a>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/img/pg1.jpg"
                alt="Outdoor Playground"
                className="rounded-lg w-full object-cover"
              />
            </div>
          </div>

          {/* 3. Archery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="/img/archery.jpg"
                alt="Archery Zone"
                className="rounded-lg w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-4">Archery Zone</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Tantang fokus dan ketepatanmu di arena panahan terbuka dengan panduan instruktur profesional.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Cocok untuk segala usia, aman, dan bisa jadi aktivitas seru bareng teman atau keluarga.
              </p>
              <a
                href="/contact"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Try It Now
              </a>
            </div>
          </div>

          {/* 4. Jungle Walk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-4">Jungle Walk</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Nikmati berjalan kaki di jalur alami dengan udara segar dan pemandangan hutan pegunungan.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Jalur yang aman, cocok untuk keluarga yang ingin menikmati wisata alam ringan.
              </p>
              <a
                href="/contact"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Try It Now
              </a>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/img/jw1.jpg"
                alt="Jungle Walk"
                className="rounded-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Siap Berpetualang di Astro Highland?
          </h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Ajak keluarga dan teman untuk menikmati keseruan aktivitas outdoor yang tak terlupakan.
          </p>
          <a
            href="/booking"
            className="bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-400 transition-transform transform hover:scale-105 shadow-xl"
          >
            Pesan Tiket Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
