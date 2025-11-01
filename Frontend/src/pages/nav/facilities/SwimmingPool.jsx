import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SwimmingPool() {
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

  const poolImages = ["/img/pool.jpg", "/img/theo-maroulis-7jXvvEMNTkc-unsplash.jpg", "/img/antonio-araujo-qOWmakQfIfM-unsplash.jpg"];

  

  return (
    <div className="min-h-screen text-gray-900 bg-white">
      {/* HERO SECTION */}
      <section
        className="relative w-full flex items-center justify-center overflow-hidden bg-white"
        style={{ minHeight: `calc(120vh - ${navHeight}px)` }}
      >
        <div className="absolute inset-0 w-full h-full z-0">
          <Slider {...sliderSettings}>
            {poolImages.map((src, index) => (
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
            Swimmming Pools <span className="text-yellow-500">Astro Highland</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero facilis nobis laudantium delectus minima maiores?
             Sint sunt iusto nobis animi quia!.
          </p>
        </div>
      </section>

      {/* ABOUT POOL SECTION */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Swimming Pool
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
            Nikmati kolam renang dengan pemandangan gunung yang menenangkan dan
            udara sejuk khas pegunungan. Baik untuk bersantai, berolahraga, atau
            menikmati waktu bersama keluarga. Didesain dengan konsep terbuka
            untuk menyatu dengan alam, menjadikan setiap momen berenang terasa
            istimewa.
          </p>
        </div>
      </section>

      {/* GRID SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kolam Dewasa */}
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-50 hover:scale-105 transition-transform duration-300">
              <img
                src="/img/roberto-nickson-h1_ILkb9tLo-unsplash.jpg"
                alt="Kolam Dewasa"
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Kolam Dewasa
                </h3>
                <p className="text-gray-600">
                  Dirancang untuk kenyamanan dan relaksasi. Dengan kedalaman
                  sekitar 1.5 meter, cocok untuk berenang santai sambil menikmati
                  panorama alam.
                </p>
              </div>
            </div>

            {/* Kolam Anak */}
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-50 hover:scale-105 transition-transform duration-300">
              <img
                src="/img/kostiantyn-li-aqZWOUY2JiY-unsplash.jpg"
                alt="Kolam Anak"
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Kolam Anak
                </h3>
                <p className="text-gray-600">
                  Aman dan menyenangkan untuk anak-anak. Kedalaman hanya 0.5
                  meter, dilengkapi area bermain air dan pengawasan lifeguard.
                </p>
              </div>
            </div>

            {/* Jacuzzi */}
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-50 hover:scale-105 transition-transform duration-300">
              <img
                src="/img/dimitris-kiriakakis-uuvue8CnM6E-unsplash.jpg"
                alt="Jacuzzi"
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Jacuzzi & Spa
                </h3>
                <p className="text-gray-600">
                  Nikmati relaksasi maksimal dengan jacuzzi air hangat. Tempat
                  ideal untuk memanjakan diri dan melepas lelah setelah
                  beraktivitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
