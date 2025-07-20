import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-10 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h4 className="text-lg font-bold mb-3 text-indigo-700">Nepali Luga</h4>
          <p className="text-sm text-gray-600">
            Your go-to clothing store designed for student life. Shop trendy, affordable, and quality fashion pieces that speak your style.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-md font-semibold mb-3 text-indigo-600">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/faq" className="hover:underline">FAQs</a></li>
            <li><a href="/returns" className="hover:underline">Return Policy</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h5 className="text-md font-semibold mb-3 text-indigo-600">Shop Categories</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="/c" className="hover:underline">Men</a></li>
            <li><a href="/" className="hover:underline">Women</a></li>
            <li><a href="/" className="hover:underline">Accessories</a></li>
            <li><a href="/" className="hover:underline">Sale</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h5 className="text-md font-semibold mb-3 text-indigo-600">Follow Us</h5>
          <div className="flex gap-4 text-lg text-indigo-500">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} CampusCart. Built with ❤️ for college fashion.
      </div>
    </footer>
  );
};

export default Footer;
