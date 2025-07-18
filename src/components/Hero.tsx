import React from 'react';
import { ArrowDown } from 'lucide-react';

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
        backgroundImage: 'linear-gradient(rgba(44, 44, 44, 0.5), rgba(44, 44, 44, 0.3)), url(/pan.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Pure Veg Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg border border-green-500/20 backdrop-blur-sm">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-green-700"></div>
            </div>
            <span className="font-display font-semibold text-sm tracking-wider">100% PURE VEG</span>
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 animate-fade-in leading-tight">
          Welcome to <span className="text-gradient-gold inline-block" style={{color: '#D4AF37'}}>Sonna's</span>
        </h1>
        
        <p className="font-body text-lg md:text-xl lg:text-2xl mb-10 animate-fade-in-delay leading-relaxed" style={{color: '#F5F5DC'}}>
          Where every cup tells a story and every moment becomes a memory
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-delay-2">
          <button
            onClick={scrollToMenu}
            className="btn-premium px-10 py-4 rounded-xl text-lg font-display font-semibold tracking-wide"
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
            className="border-2 px-10 py-4 rounded-xl text-lg font-display font-semibold tracking-wide transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            style={{
              borderColor: '#D4AF37',
              color: '#D4AF37'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#D4AF37';
            }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 opacity-70" style={{color: '#D4AF37'}} />
      </div>
    </section>
  );
};

export default Hero;