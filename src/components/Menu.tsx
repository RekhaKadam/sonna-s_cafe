import React, { useState } from 'react';
import { Star, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface MenuItem {
  name: string;
  price: number;
  description?: string;
  rating: number;
  imageUrl: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

const Menu: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  const menuData: MenuCategory[] = [
    {
      name: 'Small Bites',
      items: [
        { name: 'Korean Bun', price: 160, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
        { name: 'Chilli Korean Bun', price: 170, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
        { name: 'Potato Wedges', price: 120, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
        { name: 'Chilli Garlic Wedges', price: 150, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop' },
        { name: 'Cauliflower Florets', price: 260, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop' },
        { name: 'Sliders', price: 185, description: 'Mini Burgers (2 sliders)', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop' },
        { name: 'Sliders Appetizers', price: 260, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop' },
        { name: 'Paneer Appetizers', price: 260, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop' }
      ]
    },
    {
      name: 'House Specials',
      items: [
        { 
          name: 'Amritsari Chole with House Baked Kulche', 
          price: 240, 
          description: 'Homemade Punjabi style Chlible filled with love',
          rating: 4.9,
          imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop'
        },
        { 
          name: 'Khao Suey', 
          price: 280, 
          description: 'Coconut based Curry filled with noodles and loads of condiments',
          rating: 4.8,
          imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'
        },
        { 
          name: 'Paneer Tikka/Butter Masala with Rice or Kulcha', 
          price: 295, 
          description: 'Creamy Paneer Tikka (spicy) or Butter (sypa) Masala served with Rice of Kulcha (your choice)',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'
        },
        { 
          name: 'Dal Makhni with Rice or Kulcha', 
          price: 295, 
          description: 'Creamy homemade Kail Dal served with Rice or Kulcha (your choice)',
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
        },
        { name: 'Paneer Tikka', price: 290, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop' },
        { name: 'Customise Your Own Pizza', price: 0, rating: 4.0, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' }
      ]
    },
    {
      name: 'Pizza',
      items: [
        { name: 'Margherita', price: 230, description: 'Hand Rolled Thin Crust', rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop' },
        { name: 'Mexican', price: 270, description: 'Loaded Vegetables', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=300&fit=crop' },
        { 
          name: 'Fantasy', 
          price: 270, 
          description: 'Onions, Bellpeppers, Paneer, Coriander, and Oregano',
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
        },
        { 
          name: 'Cleitia', 
          price: 290, 
          description: 'Mushroom, Pickled Onion, Chilli Garlic Oil, Basil',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop'
        },
        { 
          name: 'Neapolitan', 
          price: 290, 
          description: 'Onions, Bellpeppers, Black Olives, Jalepeno, Chilli Garlic Oil',
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop'
        },
        { 
          name: 'Rustic', 
          price: 290, 
          description: 'Onions, Garlic Oil, Spinach, Oregano',
          rating: 4.4,
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      name: 'Drinks',
      items: [
        { name: 'Iced Teas', price: 120, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
        { name: 'Peach/Lemon/Blueberry', price: 130, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
        { name: 'Cucumber Lemonade', price: 140, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop' },
        { name: 'Mojito', price: 140, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop' },
        { name: 'Cold Coffee', price: 120, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
        { 
          name: 'Milkshakes', 
          price: 160, 
          description: 'KrKat/Vanilla/Strawberry/Chocolate',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop'
        }
      ]
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-amber-400/50 text-amber-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handleOrder = (item: MenuItem) => {
    const cartItem = {
      id: `${item.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    };
    
    addToCart(cartItem);
    
    // Show success message
    setAddedToCartMessage(`${item.name} added to cart!`);
    setTimeout(() => setAddedToCartMessage(null), 3000);
  };

  return (
    <section 
      id="menu" 
      className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 relative"
      style={{
        backgroundImage: "url('/our_story.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-white/20"></div>
      
      {/* Success Message */}
      {addedToCartMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold">
          ✅ {addedToCartMessage}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-red-800 text-lg font-medium mb-2" style={{ fontFamily: 'cursive' }}>
            Delicious Recipes
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Menu
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Explore our carefully crafted dishes made with love and the finest ingredients
          </p>
        </div>

        {/* Menu Categories */}
        <div className="space-y-8">
          {menuData.map((category) => (
            <div key={category.name} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-8 py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xl flex items-center justify-between hover:from-amber-700 hover:to-orange-700 transition-all duration-300"
              >
                <span>{category.name}</span>
                {expandedCategory === category.name ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </button>

              {/* Category Items */}
              {expandedCategory === category.name && (
                <div className="p-8 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:bg-white border border-gray-100 hover:border-amber-200 transform hover:-translate-y-1"
                      >
                        {/* Item Image */}
                        <div className="mb-4">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>

                        {/* Item Header */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-3 italic">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          <div className="flex space-x-1 mr-2">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({item.rating})
                          </span>
                        </div>

                        {/* Price and Order */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-amber-600">
                            {item.price > 0 ? `₹${item.price}` : 'Custom'}
                          </span>
                          <button
                            onClick={() => handleOrder(item)}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 text-sm"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Order Now</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? We also offer custom dishes!
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Contact Us for Custom Orders
          </button>
        </div>
      </div>
    </section>
  );
};

export default Menu;