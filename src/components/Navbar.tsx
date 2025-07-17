import React, { useState } from 'react';
import { Menu, X, Coffee, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, getTotalPrice } = useCart();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-800">Sonna's</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-amber-600 ${
                  activeSection === item.id ? 'text-amber-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5 text-amber-600" />
              <div className="flex flex-col text-xs">
                <span className="text-amber-700 font-semibold">
                  {getTotalItems()} items
                </span>
                <span className="text-amber-600 font-bold">
                  ₹{getTotalPrice()}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSection('login')}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
            >
              Login / Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 hover:text-amber-600 ${
                    activeSection === item.id ? 'text-amber-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Cart */}
              <button 
                onClick={onCartClick}
                className="flex items-center justify-center space-x-2 bg-amber-50 mx-3 py-3 rounded-lg border border-amber-200 mt-2 hover:bg-amber-100 transition-colors w-full"
              >
                <ShoppingCart className="h-5 w-5 text-amber-600" />
                <span className="text-amber-700 font-semibold">
                  {getTotalItems()} items - ₹{getTotalPrice()}
                </span>
              </button>
              
              <button
                onClick={() => setActiveSection('login')}
                className="block w-full text-left bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 mt-2"
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;