import React from "react";
import { FaFacebookF, FaInstagram, FaGithub, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="text-gray-200 pt-12 w-full"
      style={{ background: "linear-gradient(to top, #0d1140, #2a2f7a)" }}
    >
      <div className="container mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold text-yellow-400 mb-3">
            BookCourier
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            BookCourier provides fast and reliable book delivery services across
            multiple cities. Track your orders, read reviews, and get books
            delivered right to your doorstep.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/mdjunaidjewell/"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition"
            >
              <FaFacebookF />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/junaidkhanjewel/"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition"
            >
              <FaInstagram />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/mdjunaidjewel"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition"
            >
              <FaGithub />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://wa.me/+8801755715459"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Quick Links
          </h2>
          <ul className="space-y-2 text-gray-400">
            {["Home", "Books", "Dashboard", "Contact"].map((link, index) => (
              <li key={index}>
                <a href="#" className="hover:text-yellow-400 transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Contact Info
          </h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📍 Mohammadpur, Dhaka.</li>
            <li>📞 +880 1755715459</li>
            <li>✉️ support@bookcourier24.com</li>
            <li>✉️ mdjunaidjewell@gmail.com</li>
            <li>⏰ Mon - Sat: 9:00 AM - 7:00 PM</li>
          </ul>
        </div>

        {/* Other Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
            Other Info
          </h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            {["Privacy Policy", "Terms & Conditions", "FAQs"].map(
              (item, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-yellow-400 transition">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-10 py-6 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} BookCourier. All rights reserved.
        <div className="mt-1">
          Developed by{" "}
          <span className="text-yellow-400 font-semibold">Junaid Jewel</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
