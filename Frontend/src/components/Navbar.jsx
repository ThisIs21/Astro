import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false); // openMenu dipertahankan untuk mengelola dropdown (Facilities, dll)
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // 1. ROOMS DIUBAH MENJADI ARRAY KOSONG (menandakan single link)

  const dropdownItems = {
    Rooms: [], // <--- DIUBAH MENJADI SINGLE LINK
    Facilities: [
      "Adventure Park",
      "Swimming Pools",
      "Fitness Centre",
      "Transportation",
    ],
    Activities: ["Hiking", "Cycling", "Campfire"],
    Dining: ["Restaurant", "Bar", "Cafe"],
    "Meeting & Events": ["Conference Hall", "Wedding Venue"],
    Contact: [], // <--- DIUBAH MENJADI SINGLE LINK
  }; // Fungsi hover dipertahankan untuk dropdown

  const handleMouseEnter = (menu) => setOpenMenu(menu);
  const handleMouseLeave = () => setOpenMenu(null);

  // Fungsi untuk mendapatkan path dasar (digunakan oleh Rooms dan Contact)
  const getBasePath = (menuName) => {
    // Misalnya, Rooms akan ke /rooms, Contact ke /contact
    return `/${menuName.toLowerCase().replace(" ", "-").replace("&", "and")}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-amber-600 shadow-md h-16" : "bg-amber-600 h-24"
      }`}
    >
      {" "}
      <div className="flex items-center justify-between w-full px-6 mx-auto max-w-7xl h-full">
        {/* Logo - arahkan ke homepage */}{" "}
        <div className="flex items-center space-x-2 md:ml-0">
          {" "}
          <Link to="/">
           {" "}
            <img
              src="/img/logo.png"
              alt="Astro Highland Logo"
              className={`transition-all duration-300 object-contain cursor-pointer ${
                isScrolled ? "h-20" : "h-30"
              }`}
            />
            {" "}
          </Link>
         {" "}
        </div>
        {/* Mobile Menu Button */}{" "}
        <div className="md:hidden">
          {" "}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
           {" "}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
             {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
             {" "}
            </svg>
            {" "}
          </button>
         {" "}
        </div>
        {/* Desktop Menu */}{" "}
        <ul
          className={`${
            isMobileMenuOpen ? "flex flex-col" : "hidden"
          } md:flex md:items-center md:space-x-6 lg:space-x-8 font-medium absolute md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none ${
            isScrolled ? "text-white" : "text-gray-300"
          }`}
        >
          {" "}
          {Object.keys(dropdownItems).map((menu) => (
            <li
              key={menu}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(menu)}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsMobileMenuOpen(false)} // Tutup menu HP saat klik menu utama
            >
             {" "}
              {/* 2. KONDISI: Jika item adalah dropdown (panjang > 0) maka pakai <button>, jika tidak (Rooms/Contact) pakai <Link> */}
              {dropdownItems[menu].length > 0 ? (
                <button className="hover:text-yellow-600 py-2 w-full text-left">
                  {menu}
                </button>
              ) : (
                <Link
                  to={getBasePath(menu)}
                  className="hover:text-yellow-600 py-2 w-full text-left block md:inline-block"
                >
                  {menu}
                </Link>
              )}
             
              {/* Dropdown Content - HANYA RENDER JIKA ADA ITEM DI DALAMNYA */}
             {" "}
              {openMenu === menu && dropdownItems[menu].length > 0 && (
                <div
                  className="absolute top-full left-0 bg-black border border-gray-800 shadow-lg mt-2 rounded-lg py-2 w-48 z-50"
                  onMouseEnter={() => setOpenMenu(menu)}
                  onMouseLeave={handleMouseLeave}
                >
                  {" "}
                  {dropdownItems[menu].map((item, i) => (
                    <Link
                      key={i}
                      to={`/${menu.toLowerCase().replace(" ", "-")}/${item
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-900 hover:text-yellow-300"
                      onClick={() => setIsMobileMenuOpen(false)} // Tutup menu HP saat klik sub-link
                    >
                       {item}{" "}
                    </Link>
                  ))}
                  {" "}
                </div>
              )}
             {" "}
            </li>
          ))}
           {/* Gallery - Dipertahankan sebagai single link terpisah */}
          {" "}
          <li>
           {" "}
            <Link
              to="/gallery"
              className="hover:text-yellow-600 py-2 block md:inline-block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gallery{" "}
            </Link>
            {" "}
          </li>
         {" "}
        </ul>
        {/* Book Now Button */}{" "}
        <div className="hidden md:block mr-0">
          {" "}
          <Link
            to="/rooms"
            className="bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-400 transition text-sm shadow-md"
          >
            BOOK NOW {" "}
          </Link>
         {" "}
        </div>
        {" "}
      </div>
      {" "}
    </nav>
  );
}
