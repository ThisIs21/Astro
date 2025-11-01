import { useState, useEffect } from "react";

export default function FitnessCentre() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavHeight(nav.offsetHeight);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ minHeight: `calc(120vh - ${navHeight}px)` }}
      >
        <img
          src="/img/fitness.jpg"
          alt="Fitness Centre"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>

         <div
          className="relative z-20 text-center px-6 max-w-3xl flex flex-col items-center justify-center"
          style={{ minHeight: `calc(100vh - ${navHeight}px)` }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
            Fitness Centre <span className="text-yellow-500">Astro Highland</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
             Nisi cupiditate optio reiciendis id veniam deleniti reprehenderit hic nesciunt! Id perferendis non doloremque.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Fitness Centre
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
            Kami menghadirkan pengalaman kebugaran menyeluruh dengan fasilitas
            modern di tengah suasana pegunungan yang sejuk. Nikmati waktu Anda
            untuk berolahraga, berelaksasi, dan menyegarkan tubuh serta pikiran.
          </p>
        </div>
      </section>

      {/* GYM - SAUNA - STEAM ROOM SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* GYM */}
            <div className="flex flex-col items-start">
              <img
                src="/img/gym.jpg"
                alt="Gym"
                className="w-full rounded-lg shadow-lg object-cover object-center h-[400px]"
              />
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Gym Area
                </h3>
                <p className="text-gray-600">
                  Nikmati sesi latihan dengan alat-alat kebugaran terkini. Tersedia
                  treadmill, sepeda statis, hingga area latihan beban untuk
                  memenuhi berbagai kebutuhan olahraga Anda.
                </p>
              </div>
            </div>

            {/* SAUNA */}
            <div className="flex flex-col items-start mt-20">
              <img
                src="/img/sauna.jpg"
                alt="Sauna"
                className="w-full rounded-lg shadow-lg object-cover object-center h-[400px]"
              />
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Sauna Room
                </h3>
                <p className="text-gray-600">
                  Rasakan relaksasi penuh di sauna kami yang hangat dan nyaman.
                  Membantu tubuh mengeluarkan racun serta meningkatkan sirkulasi
                  darah setelah latihan.
                </p>
              </div>
            </div>

            {/* STEAM ROOM */}
            <div className="flex flex-col items-start">
              <img
                src="/img/steam.jpg"
                alt="Gym"
                className="w-full rounded-lg shadow-lg object-cover object-center h-[400px]"
              />
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Steam Room
                </h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minus praesentium dolorem non molestiae ratione,
                   nemo corrupti sit tenetur neque earum voluptas aliquam cupiditate, quis, minima provident? Praesentium,
                    voluptatum reprehenderit?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
