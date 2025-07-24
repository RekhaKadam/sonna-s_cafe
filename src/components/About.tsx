import React, { useEffect } from 'react';

interface AboutProps {
  setActiveSection: (section: string) => void;
}

const About: React.FC<AboutProps> = ({ setActiveSection }) => {
  // Handle back button behavior
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setActiveSection('home');
      window.history.pushState(null, '', window.location.href);
    };

    // Add a history entry when about section opens
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setActiveSection]);
  return (
    <section 
      id="about" 
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/cooking-hands.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-amber-600 mb-8 tracking-wider">
              O U R &nbsp; S T O R Y
            </h2>
          </div>

          {/* Story Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-800">
              <p className="font-medium">
                <span className="text-amber-600 font-bold">SONNA SUBLOK</span> LOVINGLY KNOWN
                AS <span className="text-amber-600 font-bold">'SONNA AUNTY'</span> HAS BEEN
                BAKING SINCE SHE WAS YOUNG.
              </p>
              
              <p>
                WHAT STARTED WITH A FRIEND'S
                REQUEST TURNED INTO YEARS OF
                MAKING BIRTHDAYS,
                ANNIVERSARIES, AND SPECIAL
                OCCASIONS SWEETER. ALSO
                SHARING HER KNOWLEDGE BY
                CONDUCTING COOKING AND
                BAKING CLASSES.
              </p>
              
              <p>
                THIS CAFÉ IS HER HOME, AND WE
                INVITE YOU TO ENJOY SOUL-
                FILLING FOOD AND HER HEART-
                FELT CAKES.
              </p>
              
              <p className="text-2xl font-bold text-amber-600 mt-8">
                YOU ARE OUR FAMILY.
              </p>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-lg">
                  LOVE,
                </p>
                <p className="text-xl font-semibold text-amber-600 mt-2 italic">
                  team Sonna's
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;