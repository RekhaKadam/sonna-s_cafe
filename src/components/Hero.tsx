import React from 'react';
import { ArrowDown, Star } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const scrollToMenu = () => {
    setActiveSection('menu');
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/pan.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Pure Veg Badge */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full border border-green-700"></div>
            </div>
            <span className="font-semibold text-sm">100% PURE VEG</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Welcome to <span className="text-amber-300">Sonna's</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in-delay">
          Where every cup tells a story and every moment becomes a memory
        </p>
        
        {/* Rating Section - Below Our Menu */}
        <div className="flex justify-center items-center mb-6 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="h-5 w-5 fill-amber-400/50 text-amber-400" />
            </div>
            <span className="text-xl font-bold text-amber-300">4.5</span>
            <span className="text-gray-200">|</span>
            <span className="text-gray-200 text-sm">1,200+ Happy Customers</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
          <button
            onClick={scrollToMenu}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Explore Our Menu
          </button>
          <button
            onClick={() => {
              setActiveSection('about');
              const element = document.getElementById('about');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="border-2 border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-amber-300 opacity-70" />
      </div>
    </section>
  );
};

export default Hero;