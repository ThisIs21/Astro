import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Utensils,
  Tent,
  Mountain,
  Leaf,
  Coffee,
  Camera,
  Shield,
  Headphones,
  Smile,
  Heart,
  Thermometer,
} from "lucide-react";

// ⚠️ BARU: Fungsi untuk gambar konten (800px)
const optimizedImage = (url) => `${url}?w=800&q=80`;

// 🌟 BARU: Fungsi khusus untuk Hero Section (2400px untuk resolusi tinggi)
const optimizedHeroImage = (url) => `${url}?w=2400&q=80`;

const AstroHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      title: "Escape to Nature",
    },
    {
      image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7",
      title: "Glamping Experience",
    },
    {
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      title: "Culinary Delights",
    },
    {
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
      title: "Tea Plantation Views",
    },
  ];

  const facilities = [
    {
      icon: <Utensils className="w-10 h-10" />,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      title: "Restoran Alam",
      description:
        "Nikmati hidangan lezat dengan pemandangan kebun teh yang menakjubkan. Menu kami menghadirkan cita rasa lokal dan internasional.",
      features: [
        "Menu Lokal & Internasional",
        "Pemandangan Kebun Teh",
        "Suasana Alam Terbuka",
      ],
    },
    {
      icon: <Tent className="w-10 h-10" />,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
      title: "Glamping Experience",
      description:
        "Menginap dengan konsep glamping yang nyaman di tengah alam. Rasakan pengalaman camping mewah dengan fasilitas lengkap.",
      features: ["Tenda Mewah", "Fasilitas Lengkap", "Pemandangan Alam"],
    },
    {
      icon: <Mountain className="w-10 h-10" />,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
      title: "Aktivitas Alam",
      description:
        "Berbagai kegiatan seru di alam terbuka seperti trekking, tea walk, dan aktivitas outdoor lainnya untuk semua usia.",
      features: [
        "Trekking & Hiking",
        "Tea Plantation Walk",
        "Aktivitas Keluarga",
      ],
    },
  ];

  const advantages = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Lokasi Strategis",
      description:
        "Terletak di Ciater, Subang dengan akses mudah dan pemandangan pegunungan yang menakjubkan",
    },
    {
      icon: <Thermometer className="w-6 h-6" />,
      title: "Udara Sejuk",
      description:
        "Nikmati udara pegunungan yang sejuk dan segar sepanjang hari",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Kebun Teh Asri",
      description:
        "Dikelilingi hamparan kebun teh hijau yang menenangkan mata dan jiwa",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Spot Foto Instagramable",
      description:
        "Berbagai spot foto menarik untuk mengabadikan momen berharga Anda",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fasilitas Lengkap",
      description:
        "Dilengkapi dengan fasilitas modern untuk kenyamanan maksimal",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Pelayanan Terbaik",
      description:
        "Tim profesional siap memberikan pelayanan terbaik untuk pengalaman tak terlupakan",
    },
  ];

  const stats = [
    {
      icon: <Smile className="w-6 h-6" />,
      number: "500+",
      label: "Pengunjung Puas",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      number: "50+",
      label: "Spot Foto Menarik",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      number: "24/7",
      label: "Pelayanan",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      number: "100%",
      label: "Kepuasan",
    },
  ];

  // Interval Slider (sudah benar)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); 

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // Intersection Observer (sudah benar)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50">
      {/* Hero Slider Section */}
      <div className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              // 🌟 PERBAIKAN: Menggunakan optimizedHeroImage (w=2400)
              style={{ backgroundImage: `url(${optimizedHeroImage(slide.image)})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </div>
          </div>
        ))}

        {/* Hero Content (Tidak ada perubahan) */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4 z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-2 text-amber-300 mb-4">
              <Leaf className="w-6 h-6 animate-pulse" />
              <MapPin className="w-5 h-5" />
              <span className="text-sm tracking-widest">CIATER, SUBANG</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
              ASTRO
            </h1>

            <p className="text-xl md:text-2xl font-light tracking-wide text-amber-100 max-w-2xl mx-auto">
              {slides[currentSlide].title}
            </p>

            <p className="text-base md:text-lg text-gray-200 max-w-xl mx-auto">
              Destinasi wisata yang memadukan keindahan alam kebun teh dengan
              kenyamanan modern
            </p>

            <button className="mt-8 group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10 flex items-center space-x-2">
                <span>Let's Explore Us</span>
                <Mountain className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Slider Controls (Tidak ada perubahan) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 bg-amber-500"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* --- Section About Astro --- */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              id="about-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible["about-content"]
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              {/* ... Content ... */}
              <div className="inline-block mb-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-amber-100 rounded-full">
                  <span className="text-sm font-semibold text-amber-900 tracking-wide">
                    Tentang Astro
                  </span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Destinasi Wisata Alam
                <br />
                di <span className="text-amber-600">Ciater, Subang</span>
              </h2>

              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Astro adalah destinasi wisata unik yang terletak di
                  tengah-tengah perkebunan teh Ciater, Subang. Kami menawarkan
                  pengalaman tak terlupakan dengan memadukan keindahan alam,
                  kenyamanan akomodasi, dan cita rasa kuliner yang autentik.
                </p>

                <p>
                  Dikelilingi oleh hamparan kebun teh yang hijau dan udara
                  pegunungan yang sejuk, Astro memberikan kesempatan untuk
                  melepas penat dari hiruk pikuk kota dan menikmati ketenangan
                  alam yang menyegarkan jiwa.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">
                    Lokasi Strategis
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Udara Sejuk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">
                    Pemandangan Indah
                  </span>
                </div>
              </div>
            </div>

            <div
              id="about-image"
              data-animate
              className={`transition-all duration-1000 delay-300 ${
                isVisible["about-image"]
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  // ✅ PERBAIKAN: Menggunakan optimizedImage (w=800)
                  src={optimizedImage("https://images.unsplash.com/photo-1464207687429-7505649dae38")}
                  alt="Tea Plantation"
                  loading="lazy"
                  decoding="async"
                  // ✅ PERBAIKAN: Tambah width & height untuk CLS
                  width="800"
                  height="500" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Ciater, Subang
                      </h3>
                      <p className="text-sm text-gray-600">
                        Jawa Barat, Indonesia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section Facilities --- */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div
            id="facilities-title"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["facilities-title"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* ... Title Content ... */}
            <div className="inline-block mb-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-amber-100 rounded-full">
                <span className="text-sm font-semibold text-amber-900 tracking-wide">
                  Layanan Kami
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Apa yang Ada di <span className="text-amber-600">Astro</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Astro menawarkan pengalaman wisata alam yang lengkap dengan tiga
              konsep utama yang dirancang untuk memberikan kenyamanan dan
              kepuasan maksimal bagi setiap pengunjung.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                id={`facility-${index}`}
                data-animate
                className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  isVisible[`facility-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    // ✅ Sudah menggunakan optimizedImage (w=800)
                    src={optimizedImage(facility.image)}
                    alt={facility.title}
                    loading="lazy"
                    decoding="async"
                    // ✅ PERBAIKAN: Tambah width & height untuk CLS (h-64 = 256px)
                    width="800"
                    height="256"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div
                      className={`w-14 h-14 ${facility.bgColor} rounded-2xl flex items-center justify-center ${facility.iconColor} shadow-lg`}
                    >
                      {facility.icon}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {facility.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {facility.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {facility.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section Why Choose Astro (Tidak ada perubahan) --- */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <div
            id="advantages-title"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible["advantages-title"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block mb-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full">
                <span className="text-sm font-semibold text-green-900 tracking-wide">
                  Keunggulan Astro
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mengapa Memilih <span className="text-green-700">Astro</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Astro menawarkan pengalaman wisata alam yang unik dengan berbagai
              keunggulan yang membuat kunjungan Anda menjadi tak terlupakan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                id={`advantage-${index}`}
                data-animate
                className={`group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 ${
                  isVisible[`advantage-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mb-4 text-green-700 group-hover:scale-110 transition-transform">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section Statistics (Tidak ada perubahan) --- */}
      <section className="py-16 px-4 bg-white">
        <div
          id="stats-section"
          data-animate
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible["stats-section"]
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 shadow-md">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section Call to Action (CTA) --- */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-green-800" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            // ✅ PERBAIKAN: Menggunakan optimizedHeroImage (w=2400)
            style={{
              backgroundImage: `url(${optimizedHeroImage("https://images.unsplash.com/photo-1464207687429-7505649dae38")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div
          id="cta-section"
          data-animate
          className={`relative z-10 max-w-4xl mx-auto text-center text-white transition-all duration-1000 ${
            isVisible["cta-section"]
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Siap Memulai Petualangan Anda?
          </h2>

          <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
            Rasakan pengalaman tak terlupakan di tengah keindahan alam kebun teh
            Ciater
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-amber-800 font-semibold rounded-full hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              Reservasi Sekarang
            </button>

            <button className="px-10 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-amber-800 transition-all duration-300 transform hover:scale-105">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AstroHomepage;