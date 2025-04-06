import React from "react";

function FooterPart() {
  return (
    <footer className="bg-[#2E3944] text-white py-10 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Information */}
        <div>
          <h2 className="text-lg font-semibold">Krishi Website</h2>
          <p className="text-sm mt-2">"Digital Solutions for Farmers"</p>
          <p className="text-sm mt-2">📞 +91 XXXXXXXXXX</p>
          <p className="text-sm">✉️ contact@krishiwebsite.com</p>
          <p className="text-sm">📍 XYZ, Krishi Bhavan, India</p>
        </div>

        {/* Navigation Links */}
        <div>
          <h2 className="text-lg font-semibold">Navigation</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:text-gray-400">Home</a></li>
            <li><a href="#" className="hover:text-gray-400">About Us</a></li>
            <li><a href="#" className="hover:text-gray-400">Agricultural Services</a></li>
            <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-lg font-semibold">Follow Us</h2>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-gray-400">📘 Facebook</a>
            <a href="#" className="hover:text-gray-400">🐦 Twitter</a>
            <a href="#" className="hover:text-gray-400">📷 Instagram</a>
          </div>
        </div>

      </div>

      {/* Copyright Section */}
      <div className="text-center mt-2 border-t border-gray-600 pt-4">
        <p className="text-sm">© 2025 KrishiWebsite. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default FooterPart;
