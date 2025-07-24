import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface FloatingCartProps {
  onCartClick?: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ onCartClick }) => {
  const { getTotalItems, isAnimating } = useCart();

  // Don't show the floating cart if there are no items
  if (getTotalItems() === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={onCartClick}
          className={`flex items-center space-x-3 px-4 py-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-105 ${
            isAnimating ? 'animate-cart-jiggle' : ''
          }`}
          style={{
            backgroundColor: '#36454F', // Charcoal primary color
            color: 'white'
          }}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {/* Cart count badge */}
            <span className="absolute -top-2 -right-2 bg-[#B87333] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold">
              {getTotalItems()} items
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FloatingCart;
