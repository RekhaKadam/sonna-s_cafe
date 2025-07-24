import { createContext, useContext, useState, ReactNode } from 'react';

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  loyaltyPoints?: number;
  addons?: Addon[];
}

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[]; // Add this for compatibility
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addAddon: (cartItemId: string, addon: Addon) => void;
  removeAddon: (cartItemId: string, addonId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalLoyaltyPoints: () => number;
  isAnimating: boolean;
  triggerAnimation: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

// CartProvider component
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600); // Animation duration
  };

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Find existing item with the same name instead of ID
      const existingItem = currentItems.find(item => 
        item.name.toLowerCase() === newItem.name.toLowerCase()
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          item.name.toLowerCase() === newItem.name.toLowerCase()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
    
    // Trigger animation when item is added
    triggerAnimation();
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Calculate base price
      let itemTotal = item.price * item.quantity;
      
      // Add addon prices if they exist
      if (item.addons && item.addons.length > 0) {
        const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
        itemTotal += addonTotal * item.quantity;
      }
      
      return total + itemTotal;
    }, 0);
  };

  const getTotalLoyaltyPoints = () => {
    return items.reduce((total, item) => total + ((item.loyaltyPoints || 0) * item.quantity), 0);
  };
  
  const addAddon = (cartItemId: string, addon: Addon) => {
    setItems(currentItems => 
      currentItems.map(item => {
        if (item.id === cartItemId) {
          const currentAddons = item.addons || [];
          // Only add if not already present
          if (!currentAddons.some(a => a.id === addon.id)) {
            return {
              ...item,
              addons: [...currentAddons, addon]
            };
          }
        }
        return item;
      })
    );
  };

  const removeAddon = (cartItemId: string, addonId: string) => {
    setItems(currentItems => 
      currentItems.map(item => {
        if (item.id === cartItemId && item.addons) {
          return {
            ...item,
            addons: item.addons.filter(addon => addon.id !== addonId)
          };
        }
        return item;
      })
    );
  };

  const value = {
    items,
    cartItems: items, // Add this for compatibility
    addToCart,
    removeFromCart,
    updateQuantity,
    addAddon,
    removeAddon,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalLoyaltyPoints,
    isAnimating,
    triggerAnimation,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
