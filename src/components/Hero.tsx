import { useState } from 'react';
import { Search } from 'lucide-react';

// Updated props to include setActiveSection and search functionality
interface HeroProps {
  setActiveSection?: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle order now button
  const handleOrderNow = () => {
    if (setActiveSection) {
      setActiveSection('menu');
    }
  };

  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      if (setActiveSection) {
        setActiveSection('menu');
        
        // Dispatch custom event to sync the search query with App.tsx
        const customEvent = new CustomEvent('menu-search', { 
          detail: { searchQuery: searchQuery } 
        });
        window.dispatchEvent(customEvent);
      }
    }
  };

  return (
    <section 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url("/cooking-background.jpg")', // Using the wooden table background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Header with Search Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // No need to dispatch event here as we only want to sync when actually searching
              }}
              className="w-full py-3 px-5 pr-12 rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-white/80 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Removed Pure Veg Badge */}

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in leading-tight text-white">
          Welcome to <span className="inline-block text-[#B87333]">Sonna's</span>
        </h1>
        
        <p className="font-body text-lg md:text-xl lg:text-2xl mb-8 animate-fade-in-delay leading-relaxed text-white">
          Where every cup tells a story and every moment becomes a memory
        </p>
        
        {/* Order Now button */}
        <div className="flex justify-center animate-fade-in-delay-2">
          <button
            onClick={handleOrderNow}
            className="px-10 py-4 rounded-xl text-lg font-display font-bold tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{
              backgroundColor: '#B87333', // Metallic Gold/Copper - brighter and more eye-catching
              color: 'white',
              boxShadow: '0 4px 14px rgba(184, 115, 51, 0.4)' // Add a glow effect
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#CF8F4D'; // Lighter on hover
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(184, 115, 51, 0.6)'; // Enhanced glow on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#B87333';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(184, 115, 51, 0.4)';
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;