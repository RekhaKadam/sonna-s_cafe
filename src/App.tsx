import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Orders from './components/Orders';
import Profile from './components/Profile';
import LoginSignup from './components/LoginSignup';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import OrderConfirmation from './components/OrderConfirmation';
import BottomNav from './components/BottomNav';
import FloatingCart from './components/FloatingCart';
import { CartProvider, useCart } from './contexts/CartContext';

interface User {
  name: string;
  phone: string;
}

// All the logic and JSX is moved into this new component
const AppContent = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openCartInCheckoutMode, setOpenCartInCheckoutMode] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get cart from context
  const { getTotalItems } = useCart();

  const handleCartClose = () => {
    setIsCartOpen(false);
    setOpenCartInCheckoutMode(false);
  };

  useEffect(() => {
    if (activeSection === 'login') {
      setIsLoginOpen(true);
    } else {
      setIsLoginOpen(false);
    }
  }, [activeSection]);

  // Listen for search events from the Menu component
  useEffect(() => {
    const handleMenuSearch = (event: any) => {
      if (event.detail && event.detail.searchQuery !== undefined) {
        setSearchQuery(event.detail.searchQuery);
      }
    };

    window.addEventListener('menu-search', handleMenuSearch);
    return () => {
      window.removeEventListener('menu-search', handleMenuSearch);
    };
  }, []);

  // Listen for open cart events
  useEffect(() => {
    const handleOpenCart = (event: any) => {
      setIsCartOpen(true);
      if (event.detail && event.detail.openInCheckoutMode) {
        setOpenCartInCheckoutMode(true);
      }
    };

    window.addEventListener('open-cart', handleOpenCart);
    return () => {
      window.removeEventListener('open-cart', handleOpenCart);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Only track scroll for single-section views since menu is now separate
      if (activeSection === 'orders' || activeSection === 'menu' || activeSection === 'about' || 
          activeSection === 'checkout' || activeSection === 'payment' || activeSection === 'orderConfirmation') {
        // Don't track scroll for these dedicated sections
        return;
      }
      
      // For home section
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const homeElement = document.getElementById('home');
      
      if (homeElement && scrollPosition >= homeElement.offsetTop && scrollPosition < homeElement.offsetTop + homeElement.offsetHeight) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="min-h-screen pb-16"> {/* Added padding bottom for the bottom nav */}
      {/* Removed top nav for Menu section */}
      
      <main>
        {activeSection === 'orders' ? (
          <div id="orders">
            <Orders setActiveSection={setActiveSection} />
          </div>
        ) : activeSection === 'menu' ? (
          <div id="menu">
            <Menu 
              setActiveSection={setActiveSection} 
              searchQuery={searchQuery}
            />
          </div>
        ) : activeSection === 'profile' ? (
          <div id="profile">
            <Profile 
              setActiveSection={setActiveSection}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>
        ) : activeSection === 'checkout' ? (
          <Checkout 
            onProceedToPayment={(data) => {
              setCheckoutData(data);
              setActiveSection('payment');
            }} 
          />
        ) : activeSection === 'payment' ? (
          <Payment 
            customerData={checkoutData}
            onPaymentComplete={(data) => {
              setOrderData(data);
              setActiveSection('orderConfirmation');
            }}
          />
        ) : activeSection === 'orderConfirmation' ? (
          <OrderConfirmation 
            orderData={orderData}
            onContinueShopping={() => {
              setActiveSection('menu');
            }}
          />
        ) : (
          <div id="home">
            <Hero 
              setActiveSection={setActiveSection} 
            />
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onCartClick={() => setIsCartOpen(true)}
        totalItems={getTotalItems()}
      />
      
      {/* Floating Cart Button */}
      <FloatingCart onCartClick={() => setIsCartOpen(true)} />

      <LoginSignup 
        isOpen={isLoginOpen} 
        onClose={() => {
          setIsLoginOpen(false);
          setActiveSection('home'); 
        }} 
        onLoginSuccess={(user: User) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          setIsLoginOpen(false);
          if (postLoginAction) {
            postLoginAction();
            setPostLoginAction(null);
          } else {
            setActiveSection('home');
          }
        }}
      />
      
      <Cart 
        isOpen={isCartOpen}
        onClose={handleCartClose}
        openInCheckoutMode={openCartInCheckoutMode}
        isLoggedIn={isLoggedIn}
        setActiveSection={setActiveSection}
        currentUser={currentUser}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
};

// The main App component now only provides the context
function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;