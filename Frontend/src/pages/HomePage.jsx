import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomePage() {
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

  const images = ["/img/h1.jpg", "/img/h2.jpg", "/img/h4.jpg", "/img/h5.jpg"];

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
                  alt={`Slide ${index + 1}`}
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
            Nikmati Keindahan{" "}
            <span className="text-yellow-500">Astro Highland</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
            Tempat terbaik untuk melepas penat, menikmati udara sejuk, dan
            pemandangan alam yang menenangkan.
          </p>
          <a
            href="/rooms"
            className="bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-400 transition-transform transform hover:scale-105 shadow-xl"
          >
            Cek Kamar & Tarif Sekarang
          </a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Tentang Astro Highland</h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Astro Highland adalah destinasi sempurna untuk melepas penat di
            tengah keindahan alam pegunungan. Dengan fasilitas modern dan
            pemandangan memukau, kami menawarkan pengalaman menginap yang tak
            terlupakan.
          </p>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 space-y-24">
          {/* 1. Staying */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="/img/pool.jpg"
                alt="Hotel View"
                className="rounded-lg w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Staying at Astro Highland
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Pilih dari berbagai kamar dengan desain unik dan pemandangan
                indah. Dari suite bergaya modern hingga vila eksklusif dengan
                balkon pribadi yang menghadap ke lembah, semua dibuat untuk
                kenyamanan maksimal.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Nikmati tempat tidur nyaman dan suasana tenang yang sempurna
                untuk beristirahat setelah menjelajahi keindahan alam sekitar.
              </p>
              <a
                href="/rooms"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Explore
              </a>
            </div>
          </div>

          {/* 2. Dining */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-4">Dining</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Nikmati hidangan lezat khas pegunungan yang dibuat dari bahan
                segar lokal. Restoran kami menghadirkan cita rasa tradisional
                dengan sentuhan modern, disajikan di tempat dengan pemandangan
                menakjubkan.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Dari sarapan hingga makan malam romantis, setiap hidangan
                dikurasi oleh chef profesional kami untuk menghadirkan
                pengalaman kuliner terbaik.
              </p>
              <a
                href="/dining"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Explore
              </a>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/img/dining.jpg"
                alt="Dining Experience"
                className="rounded-lg w-full object-cover"
              />
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="/img/pool.jpg"
                alt="Hotel View"
                className="rounded-lg w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Staying at Astro Highland
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Pilih dari berbagai kamar dengan desain unik dan pemandangan
                indah. Dari suite bergaya modern hingga vila eksklusif dengan
                balkon pribadi yang menghadap ke lembah, semua dibuat untuk
                kenyamanan maksimal.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Nikmati tempat tidur nyaman dan suasana tenang yang sempurna
                untuk beristirahat setelah menjelajahi keindahan alam sekitar.
              </p>
              <a
                href="/rooms"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Explore
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-4">Dining</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Nikmati hidangan lezat khas pegunungan yang dibuat dari bahan
                segar lokal. Restoran kami menghadirkan cita rasa tradisional
                dengan sentuhan modern, disajikan di tempat dengan pemandangan
                menakjubkan.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Dari sarapan hingga makan malam romantis, setiap hidangan
                dikurasi oleh chef profesional kami untuk menghadirkan
                pengalaman kuliner terbaik.
              </p>
              <a
                href="/dining"
                className="font-semibold text-black border-b-2 border-black pb-1 hover:text-yellow-600 transition"
              >
                Explore
              </a>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/img/dining.jpg"
                alt="Dining Experience"
                className="rounded-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Petualangan?</h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Pesan sekarang dan dapatkan pengalaman terbaik di Astro Highland.
          </p>
          <a
            href="/rooms"
            className="bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-400 transition-transform transform hover:scale-105 shadow-xl"
          >
            Lihat Semua Kamar
          </a>
        </div>
      </section>
    </div>
  );
}
