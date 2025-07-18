import React, { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Contact from './components/Contact';
import LoginSignup from './components/LoginSignup';
import Cart from './components/Cart';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handle login/signup modal
  useEffect(() => {
    if (activeSection === 'login') {
      setIsLoginOpen(true);
      setActiveSection('home'); // Reset to home after opening modal
    }
  }, [activeSection]);

  // Handle scroll-based active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'menu', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Special case for home section (top of page)
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onCartClick={() => setIsCartOpen(true)}
        />
        
        <main>
          <div id="home">
            <Hero setActiveSection={setActiveSection} />
          </div>
          <About />
          <Menu onCartToggle={() => setIsCartOpen(true)} />
          <Contact />
        </main>

        <Footer />
        
        <LoginSignup 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
        />
        
        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </CartProvider>
  );
}

export default App;