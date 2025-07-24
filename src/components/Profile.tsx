import React, { useState, useEffect } from 'react';
import { User, Gift, ShoppingBag, Phone, LogOut } from 'lucide-react';

interface ProfileProps {
  setActiveSection: (section: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  currentUser: { name: string; phone: string } | null;
  setCurrentUser: (user: { name: string; phone: string } | null) => void;
}

interface UserProfile {
  name: string;
  phone: string;
  loyaltyPoints: number;
  orders: number;
}

const Profile: React.FC<ProfileProps> = ({ 
  setActiveSection, 
  isLoggedIn, 
  setIsLoggedIn, 
  currentUser, 
  setCurrentUser 
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle back button behavior
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Go back to home when back button is pressed
      event.preventDefault();
      setActiveSection('home');
      window.history.pushState(null, '', window.location.href);
    };

    // Add a history entry when profile section opens
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);
    
    // Load profile data from localStorage
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile) as UserProfile;
        setProfile(parsedProfile);
      } else if (currentUser) {
        // Create basic profile from current user if no saved profile
        setProfile({
          name: currentUser.name,
          phone: currentUser.phone,
          loyaltyPoints: 0,
          orders: 0
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate loading delay
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setActiveSection, currentUser]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    // Don't clear profile data from localStorage to persist between sessions
    setActiveSection('home');
  };

  if (!isLoggedIn) {
    return (
      <section id="profile" className="py-24 pt-32 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">Not Logged In</h2>
            <p className="text-gray-500 mb-6">Please log in to view your profile</p>
            <button 
              onClick={() => setActiveSection('menu')}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: '#808000' }}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="profile" className="py-24 pt-32 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#808000' }}>
          Your Profile
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#808000' }}></div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-24"></div>
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-lg">
                  <div className="bg-amber-100 h-20 w-20 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-amber-600" />
                  </div>
                </div>
                
                <div className="pt-14 text-center mb-6">
                  <h2 className="text-2xl font-bold mb-1">{profile?.name || currentUser?.name}</h2>
                  <div className="flex items-center justify-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <p>{profile?.phone || currentUser?.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Gift className="h-6 w-6 text-amber-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Loyalty Points</h3>
                    </div>
                    <p className="text-xl font-bold text-amber-600">{profile?.loyaltyPoints || 0}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ShoppingBag className="h-6 w-6 text-amber-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Orders</h3>
                    </div>
                    <p className="text-xl font-bold text-amber-600">{profile?.orders || 0}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveSection('orders')}
                  className="w-full py-3 bg-amber-50 text-amber-700 rounded-lg font-semibold mb-3 hover:bg-amber-100 transition-colors"
                >
                  View Your Orders
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full py-3 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
