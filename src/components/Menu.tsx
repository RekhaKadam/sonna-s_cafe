import React, { useState, useEffect } from 'react';
import { ShoppingCart, Pizza, Soup, Utensils, Sandwich, ChefHat, Beef, Droplets, Sparkles, Grid3X3, Flame, Gift, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface MenuItem {
  name: string;
  price: number;
  description?: string;
  rating: number;
  imageUrl: string;
  spiceLevel: 0 | 1 | 2 | 3; // 0: No spice, 1: Mild, 2: Medium, 3: Hot
  loyaltyPoints: number;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface MenuProps {
  setActiveSection: (section: string) => void;
  searchQuery?: string;
}

const Menu: React.FC<MenuProps> = ({ setActiveSection, searchQuery = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Special');
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const [cartItemCounts, setCartItemCounts] = useState<{[itemName: string]: number}>({});

  // Update cart item counts when cart items change
  useEffect(() => {
    const counts: {[itemName: string]: number} = {};
    items.forEach(item => {
      const key = item.name.toLowerCase().replace(/\s+/g, '-');
      counts[key] = (counts[key] || 0) + item.quantity;
    });
    setCartItemCounts(counts);
  }, [items]);

  const handleAddToCart = (item: MenuItem & { category: string }) => {
    const itemKey = item.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if this item already exists in the cart
    const existingItems = items.filter(cartItem => 
      cartItem.name.toLowerCase() === item.name.toLowerCase()
    );
    
    if (existingItems.length > 0) {
      // Just update the first one instead of adding a new one
      updateQuantity(existingItems[0].id, existingItems[0].quantity + 1);
    } else {
      // Add as new item
      const cartItem = {
        id: `${itemKey}-${Date.now()}`,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        loyaltyPoints: item.loyaltyPoints
      };
      
      addToCart(cartItem);
    }
  };

  // Handle back button behavior
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Go back to home when back button is pressed
      event.preventDefault();
      setActiveSection('home');
      window.history.pushState(null, '', window.location.href);
    };

    // Add a history entry when menu section opens
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setActiveSection]);

  // Get all categories including "Special" and "All"
  const getAllCategories = () => {
    return ['Special', ...menuData.map(cat => cat.name)];
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (category) {
      case 'Special': return <Sparkles {...iconProps} />;
      case 'All': return <Grid3X3 {...iconProps} />;
      case 'Appetizers': return <Utensils {...iconProps} />;
      case 'Paneer Specialties': return <ChefHat {...iconProps} />;
      case 'Soups': return <Soup {...iconProps} />;
      case 'Pasta': return <Utensils {...iconProps} />;
      case 'Pizza': return <Pizza {...iconProps} />;
      case 'Burgers': return <Beef {...iconProps} />;
      case 'Sandwiches & Rolls': return <Sandwich {...iconProps} />;
      case 'Indian Specials': return <ChefHat {...iconProps} />;
      case 'Chinese & Rice': return <Utensils {...iconProps} />;
      case 'Drinks': return <Droplets {...iconProps} />;
      default: return <Utensils {...iconProps} />;
    }
  };

  // Render spice level indicators
  const renderSpiceLevel = (level: number) => {
    const spiceLabels = ['No Spice', 'Mild', 'Medium', 'Hot'];
    const spiceColors = ['text-[#B2B2B2]', 'text-[#BDECB6]', 'text-[#E6B4B4]', 'text-[#B87333]'];
    
    return (
      <div className="flex items-center space-x-1">
        <Flame className={`h-3 w-3 ${spiceColors[level]}`} />
        <span className={`text-xs ${spiceColors[level]} font-medium`}>
          {spiceLabels[level]}
        </span>
      </div>
    );
  };

  // Render loyalty points
  const renderLoyaltyPoints = (points: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Gift className="h-3 w-3 text-[#B87333]" />
        <span className="text-xs text-[#B87333] font-medium">
          {points} pts
        </span>
      </div>
    );
  };

  // Function to filter items based on search query
  const filterItemsBySearch = (items: (MenuItem & { category: string })[], query: string) => {
    if (!query.trim()) return items;
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    return items.filter(item => {
      const nameMatch = searchTerms.some(term => 
        item.name.toLowerCase().includes(term)
      );
      const descriptionMatch = item.description ? searchTerms.some(term => 
        item.description?.toLowerCase().includes(term)
      ) : false;
      
      return nameMatch || descriptionMatch;
    });
  };

  // Get filtered items based on selected category and search query
  const getFilteredItems = () => {
    let items: (MenuItem & { category: string })[] = [];
    
    if (selectedCategory === 'All') {
      items = menuData.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.name })));
    } else if (selectedCategory === 'Special') {
      // Show highly rated items (4.7+) from all categories
      items = menuData.flatMap(cat => 
        cat.items
          .filter(item => item.rating >= 4.7)
          .map(item => ({ ...item, category: cat.name }))
      );
    } else {
      const category = menuData.find(cat => cat.name === selectedCategory);
      items = category ? category.items.map(item => ({ ...item, category: category.name })) : [];
    }
    
    // Apply search filter if query exists
    return filterItemsBySearch(items, searchQuery);
  };

  const menuData: MenuCategory[] = [
    {
      name: 'Appetizers',
      items: [
        { name: 'Korean Bun', price: 160, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 8 },
        { name: 'Chilli Korean Bun', price: 170, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 9 },
        { name: 'Potato Wedges', price: 120, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { name: 'Chilli Garlic Wedges', price: 150, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 7 },
        { name: 'French Fries', price: 100, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 5 },
        { name: 'Nachos', price: 180, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 9 },
        { name: 'Honey Chilli Potato', price: 140, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 7 },
        { name: 'Cauliflower Florets', price: 160, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 8 }
      ]
    },
    {
      name: 'Paneer Specialties',
      items: [
        { name: 'Chettni Paneer', price: 220, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 11 },
        { name: 'Tom Yum Paneer', price: 240, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', spiceLevel: 3, loyaltyPoints: 12 },
        { name: 'Paneer Makhni Slider', price: 185, description: 'Mini slider with paneer makhni', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 9 },
        { name: 'Mushroom Slider', price: 175, description: 'Mini slider with mushrooms', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 9 }
      ]
    },
    {
      name: 'Soups',
      items: [
        { name: 'Bellpepper Soup', price: 120, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { name: 'Cream of Mushroom', price: 130, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { name: 'Manchow Soup', price: 110, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 5 },
        { name: 'Pesto Zucchini Soup', price: 140, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 7 }
      ]
    },
    {
      name: 'Pasta',
      items: [
        { name: 'Arrabiata', price: 180, description: 'Spicy tomato-based pasta', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 9 },
        { name: 'Alfredo', price: 200, description: 'Creamy white sauce pasta', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 10 },
        { name: 'Pink Sauce', price: 190, description: 'Tomato and cream sauce', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 9 },
        { name: 'Mafia', price: 220, description: 'Special house pasta', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 11 },
        { name: 'Pesto', price: 210, description: 'Basil and herb pasta', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d51b?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 10 },
        { name: 'Aglio e Olio', price: 170, description: 'Garlic and olive oil pasta', rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 8 }
      ]
    },
    {
      name: 'Pizza',
      items: [
        { name: 'Margherita', price: 230, description: 'Hand Rolled Thin Crust', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 11 },
        { name: 'Mexican', price: 270, description: 'Loaded Vegetables', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 13 },
        { 
          name: 'Fantasy', 
          price: 270, 
          description: 'Onions, Bellpeppers, Paneer, Coriander, and Oregano',
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
          spiceLevel: 1,
          loyaltyPoints: 13
        },
        { 
          name: 'Cicilia', 
          price: 290, 
          description: 'Mushroom, Pickled Onion, Chilli Garlic Oil, Basil',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',
          spiceLevel: 2,
          loyaltyPoints: 14
        },
        { 
          name: 'Neapolitan', 
          price: 290, 
          description: 'Onions, Bellpeppers, Black Olives, Jalepeno, Chilli Garlic Oil',
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop',
          spiceLevel: 2,
          loyaltyPoints: 14
        },
        { 
          name: 'Rustic', 
          price: 290, 
          description: 'Onions, Garlic Oil, Spinach, Oregano',
          rating: 4.4,
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
          spiceLevel: 1,
          loyaltyPoints: 14
        },
        { name: 'Paneer Tikka Pizza', price: 320, description: 'Pizza topped with spiced paneer tikka', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 16 }
      ]
    },
    {
      name: 'Burgers',
      items: [
        { name: 'Veg Burger', price: 150, description: 'Classic vegetable burger', rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 7 },
        { name: 'Mexican Burger', price: 180, description: 'Spicy Mexican style burger', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 9 },
        { name: 'Cheese Burger', price: 170, description: 'Loaded with cheese', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 8 },
        { name: 'Magic Mushroom', price: 190, description: 'Mushroom burger with special sauce', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 9 }
      ]
    },
    {
      name: 'Sandwiches & Rolls',
      items: [
        { name: 'Veg Sandwich', price: 120, description: 'Fresh vegetable sandwich', rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { name: 'Paneer Tikka Sandwich', price: 150, description: 'Grilled paneer tikka sandwich', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 7 },
        { name: 'Bombay Masala Sandwich', price: 140, description: 'Mumbai style masala sandwich', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop', spiceLevel: 2, loyaltyPoints: 7 },
        { name: 'Spicy Paneer Roll', price: 160, description: 'Spicy paneer wrapped in roll', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop', spiceLevel: 3, loyaltyPoints: 8 }
      ]
    },
    {
      name: 'Indian Specials',
      items: [
        { 
          name: 'Amritsari Chole Kulche', 
          price: 240, 
          description: 'Homemade Punjabi style Chole with fresh Kulche',
          rating: 4.9,
          imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
          spiceLevel: 2,
          loyaltyPoints: 12
        },
        { 
          name: 'Khao Suey', 
          price: 280, 
          description: 'Coconut based Curry filled with noodles and loads of condiments',
          rating: 4.8,
          imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
          spiceLevel: 2,
          loyaltyPoints: 14
        },
        { 
          name: 'Paneer Tikka Masala', 
          price: 295, 
          description: 'Creamy Paneer Tikka in rich tomato gravy',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
          spiceLevel: 2,
          loyaltyPoints: 15
        },
        { 
          name: 'Dal Makhni with Rice', 
          price: 260, 
          description: 'Creamy homemade Dal Makhni served with Rice',
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
          spiceLevel: 1,
          loyaltyPoints: 13
        }
      ]
    },
    {
      name: 'Chinese & Rice',
      items: [
        { name: 'Veg Fried Rice', price: 180, description: 'Wok-tossed rice with vegetables', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 9 },
        { name: 'Hakka Noodles', price: 170, description: 'Stir-fried noodles with vegetables', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 8 },
        { name: 'Schezwan Noodles', price: 190, description: 'Spicy Schezwan style noodles', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', spiceLevel: 3, loyaltyPoints: 9 },
        { name: 'Paneer Fried Rice', price: 200, description: 'Fried rice with paneer cubes', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', spiceLevel: 1, loyaltyPoints: 10 }
      ]
    },
    {
      name: 'Drinks',
      items: [
        { name: 'Iced Teas', price: 120, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { name: 'Peach/Lemon/Blueberry', price: 130, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { name: 'Cucumber Lemonade', price: 140, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 7 },
        { name: 'Mojito', price: 140, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 7 },
        { name: 'Cold Coffee', price: 120, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', spiceLevel: 0, loyaltyPoints: 6 },
        { 
          name: 'Milkshakes', 
          price: 160, 
          description: 'KitKat/Vanilla/Strawberry/Chocolate',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
          spiceLevel: 0,
          loyaltyPoints: 8
        }
      ]
    }
  ];

  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleOrder = (item: MenuItem & { category: string }) => {
    // Use the handleAddToCart function to avoid duplication
    handleAddToCart(item);
  };

  const handleOrderNow = (item: MenuItem & { category: string }) => {
    // Use handleAddToCart to add item to cart
    handleAddToCart(item);
    
    // Dispatch a custom event to tell the App component to open the cart
    const event = new CustomEvent('open-cart', { 
      detail: { openInCheckoutMode: true }
    });
    window.dispatchEvent(event);
  };
  
  const handleUpdateQuantity = (item: MenuItem & { category: string }, change: number) => {
    const itemKey = item.name.toLowerCase().replace(/\s+/g, '-');
    const count = cartItemCounts[itemKey] || 0;
    
    if (count + change <= 0) {
      // Find all cart items with this name and remove them
      const itemsToRemove = items.filter(cartItem => 
        cartItem.name.toLowerCase() === item.name.toLowerCase()
      );
      itemsToRemove.forEach(cartItem => removeFromCart(cartItem.id));
    } else {
      // Just add a new one with quantity 1
      if (change > 0) {
        handleAddToCart(item);
      } else {
        // Find the first item with this name and decrement its quantity
        const cartItem = items.find(cartItem => 
          cartItem.name.toLowerCase() === item.name.toLowerCase()
        );
        if (cartItem) {
          updateQuantity(cartItem.id, cartItem.quantity - 1);
        }
      }
    }
  };

  return (
    <section 
      id="menu" 
      className="py-8 bg-[#E6B4B4]/10 relative min-h-screen"
    >
      {/* Header with back button and title */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setActiveSection('home')}
            className="flex items-center text-[#36454F] hover:text-[#B87333] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Home</span>
          </button>
          
          <h1 className="text-xl font-semibold text-[#36454F]">Our Menu</h1>
          
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>
      </div>
      
      {/* Add padding to account for fixed header */}
      <div className="pt-16"></div>
      
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Category Chip Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white py-4 mb-6">
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex space-x-2 sm:space-x-3 w-max min-w-full justify-start">
              {getAllCategories().map((category) => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 shadow-sm flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-white text-[#B87333] border border-[#B87333] shadow-md'
                      : 'bg-gray-100 text-[#36454F] hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category)}
                  <span className="hidden sm:inline">{category}</span>
                  <span className="sm:hidden">{category.slice(0, 8)}{category.length > 8 ? '...' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filtered Menu Items */}
        <div className="space-y-3 px-2 sm:px-4">
          {getFilteredItems().map((item, index) => (
            <div
              key={`${item.category}-${item.name}-${index}`}
              className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-row items-center gap-3 sm:gap-4">
                {/* Item Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 sm:w-16 sm:h-16 object-cover rounded-lg"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-[#36454F] mb-1 truncate">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-[#B2B2B2] mb-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Spice Level and Loyalty Points */}
                      <div className="flex items-center justify-between mb-2">
                        {renderSpiceLevel(item.spiceLevel)}
                        {renderLoyaltyPoints(item.loyaltyPoints)}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:space-y-2 sm:ml-4">
                      <span className="text-lg font-bold text-[#B87333] order-1 sm:order-none">
                        ₹{item.price}
                      </span>
                      
                      <div className="flex space-x-2 order-2 sm:order-none">
                        {cartItemCounts[item.name.toLowerCase().replace(/\s+/g, '-')] > 0 ? (
                          <div className="flex items-center space-x-1 bg-[#E6B4B4]/20 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item, -1)}
                              className="p-2 text-[#36454F] hover:bg-[#E6B4B4]/40 rounded-l-lg transition-colors duration-200"
                              title="Remove One"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-semibold px-1">
                              {cartItemCounts[item.name.toLowerCase().replace(/\s+/g, '-')]}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, 1)}
                              className="p-2 text-[#36454F] hover:bg-[#E6B4B4]/40 rounded-r-lg transition-colors duration-200"
                              title="Add One"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOrder(item)}
                            className="bg-[#E6B4B4]/20 hover:bg-[#E6B4B4]/40 text-[#36454F] p-2 rounded-lg transition-colors duration-200 flex-shrink-0"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOrderNow(item)}
                          className="bg-[#B87333] hover:bg-[#A36326] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-200 flex-shrink-0"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {getFilteredItems().length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#36454F] mb-4">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "No items found in this category"}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSelectedCategory('All')}
                className="mt-2 px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#B8860B] transition-colors"
              >
                View all items
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;