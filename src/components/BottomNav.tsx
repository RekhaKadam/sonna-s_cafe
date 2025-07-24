import React from 'react';
import { Home, Menu as MenuIcon, ShoppingBag, ShoppingCart, UserCircle } from 'lucide-react';

interface BottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onCartClick: () => void;
  totalItems: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, setActiveSection, onCartClick, totalItems }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="flex flex-1 flex-col items-center justify-center py-2"
            >
              <Icon
                className={`h-6 w-6 ${
                  activeSection === item.id ? 'text-[#36454F]' : 'text-[#B2B2B2]'
                }`}
              />
              <span
                className={`text-xs mt-1 ${
                  activeSection === item.id ? 'text-[#36454F] font-medium' : 'text-[#B2B2B2]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={onCartClick}
          className="flex flex-1 flex-col items-center justify-center py-2 relative"
        >
          <ShoppingCart className={`h-6 w-6 text-[#B2B2B2]`} />
          {totalItems > 0 && (
            <span className="absolute top-1 right-6 bg-[#B87333] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="text-xs mt-1 text-[#B2B2B2]">Cart</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
