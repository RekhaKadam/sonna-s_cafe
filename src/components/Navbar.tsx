import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onCartClick: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeSection, 
  setActiveSection, 
  onCartClick,
  searchQuery,
  setSearchQuery 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, isAnimating } = useCart();
  
  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setActiveSection('menu');
      // Close mobile menu if it's open
      setIsMenuOpen(false);
      // Navigate to menu section
      const menuElement = document.getElementById('menu');
      if (menuElement) {
        menuElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle back button behavior for mobile sidebar
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isMenuOpen) {
        event.preventDefault();
        setIsMenuOpen(false);
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Add a history entry when sidebar opens
    if (isMenuOpen) {
      window.history.pushState(null, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMenuOpen]);

  // Removed menu navigation items
  const navItems: { id: string; label: string }[] = [];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    
    if (sectionId === 'home') {
      // Do not scroll on its own for home section
      return;
    } else {
      // For contact section, we need to wait a bit for the component to render
      if (sectionId === 'contact') {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 backdrop-blur-md shadow-lg z-50 transition-all duration-300" style={{backgroundColor: 'rgba(254, 252, 243, 0.95)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 relative">
          {/* Left: Hamburger menu for mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-amber-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent w-64"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-[#B87333]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right: Cart icon with total amount */}
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10 ml-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-body text-base font-medium transition-colors duration-300 tracking-wide ${
                    activeSection === item.id ? '' : ''
                  }`}
                  style={{
                    color: activeSection === item.id ? '#D4AF37' : '#5D5D5D'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = activeSection === item.id ? '#D4AF37' : '#5D5D5D';
                  }}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Removed Login/Sign Up button */}
            </div>

            {/* Cart button for mobile */}
            <div className="md:hidden">
              <button 
                onClick={onCartClick}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isAnimating ? 'animate-cart-jiggle' : ''
                }`}
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  borderColor: 'rgba(212, 175, 55, 0.3)'
                }}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" style={{color: '#D4AF37'}} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                {getTotalItems() > 0 && (
                  <div className="flex flex-col text-xs">
                    <span className="font-body font-semibold" style={{color: '#8B4513'}}>
                      {getTotalItems()}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            {/* Mobile Search Bar */}
            <div className="px-4 pt-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D4AF37]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
            
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                    scrollToSection(item.id);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 hover:text-amber-600 ${
                    activeSection === item.id ? 'text-amber-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Removed Login/Sign Up button */}
            </div>
          </div>
        )}

        {/* Cart button for desktop - positioned in top right corner */}
        <div className="hidden md:flex items-center absolute top-1/2 right-4 transform -translate-y-1/2">
          <button 
            onClick={onCartClick}
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
              isAnimating ? 'animate-cart-jiggle' : ''
            }`}
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderColor: 'rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
            }}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" style={{color: '#D4AF37'}} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-body font-semibold" style={{color: '#8B4513'}}>
                {getTotalItems()} items
              </span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;