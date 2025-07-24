import React from 'react';
import { Coffee, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-amber-400" />
              <span className="text-2xl font-bold">Sonna's</span>
            </div>
            <p className="text-gray-300">
              Where every cup tells a story and every moment becomes a memory. 
              Join us for exceptional coffee and warm hospitality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">About Us</a></li>
              <li><a href="#menu" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">Menu</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Menu</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Coffee & Espresso</span></li>
              <li><span className="text-gray-300">Tea & Beverages</span></li>
              <li><span className="text-gray-300">Fresh Pastries</span></li>
              <li><span className="text-gray-300">Light Meals</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">123 Coffee Street, Downtown District</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">hello@sonnas.cafe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 Sonnas Cafe. All rights reserved. Made with ❤️ for coffee lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;