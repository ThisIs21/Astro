export default function Footer() {
  return (
    <footer className="bg-black text-gray-200 py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Reservations */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Reservations</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-yellow-500">Book online</a></li>
            <li><a href="#" className="hover:text-yellow-500">Enquire</a></li>
            <li><a href="#" className="hover:text-yellow-500">Email us (Rest of the World)</a></li>
            <li><a href="#" className="hover:text-yellow-500">Email us (USA Office)</a></li>
            <li><a href="#" className="hover:text-yellow-500">Modify a reservation</a></li>
          </ul>
        </div>

        {/* About us */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">About us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-yellow-500">Our commitment</a></li>
            <li><a href="#" className="hover:text-yellow-500">FAQs</a></li>
            <li><a href="#" className="hover:text-yellow-500">Trade and press</a></li>
            <li><a href="#" className="hover:text-yellow-500">Careers</a></li>
            <li><a href="#" className="hover:text-yellow-500">Virgin Group</a></li>
            <li><a href="#" className="hover:text-yellow-500">Virgin Hotels Collection</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">The legal bits</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-yellow-500">Terms and conditions</a></li>
            <li><a href="#" className="hover:text-yellow-500">Privacy policy</a></li>
            <li><a href="#" className="hover:text-yellow-500">Cookie policy</a></li>
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Follow us</h3>
          <div className="flex space-x-4 mb-4">
            <a href="" className="p-2 rounded-full border border-gray-500 hover:bg-yellow-500 hover:border-yellow-500 transition">
              <i className="fa-brands fa-x-twitter text-white"></i>
            </a>
            <a href="#" className="p-2 rounded-full border border-gray-500 hover:bg-yellow-500 hover:border-yellow-500 transition">
              <i className="fa-brands fa-facebook-f text-white"></i>
            </a>
            <a href="#" className="p-2 rounded-full border border-gray-500 hover:bg-yellow-500 hover:border-yellow-500 transition">
              <i className="fa-brands fa-instagram text-white"></i>
            </a>
          </div>
          <p className="text-xs text-gray-500">
            © 2025 Astro Highland. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Logo Section */}
      <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16">
  <img
    src="/img/cp1.png"
    alt="Partner 1"
    className="h-35 object-contain invert brightness-200"
  />
  <img
    src="/img/cp2.png"
    alt="Partner 2"
    className="h-35 object-contain invert brightness-200"
  />
  <img
    src="/img/cp3.png"
    alt="Partner 3"
    className="h-35 object-contain invert brightness-200"
  />
</div>

    </footer>
  );
}
