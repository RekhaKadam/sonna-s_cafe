import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag } from 'lucide-react';

interface OrdersProps {
  setActiveSection: (section: string) => void;
}

// Define Order interface
interface Order {
  id: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
}

const Orders: React.FC<OrdersProps> = ({ setActiveSection }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle back button behavior
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Go back to home when back button is pressed
      event.preventDefault();
      setActiveSection('home');
      window.history.pushState(null, '', window.location.href);
    };

    // Add a history entry when orders section opens
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);
    
    // Load order data from localStorage
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders) as Order[];
        setOrders(parsedOrders);
      } else {
        // No saved orders - keep empty array
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      // Set empty array on error
      setOrders([]);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate loading delay
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setActiveSection]);
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="orders" className="py-8 pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#808000' }}>
          Your Orders
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#808000' }}></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet</p>
            <button 
              onClick={() => setActiveSection('menu')}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: '#808000' }}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg mb-2">Order #{order.id}</p>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        <p>{new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-medium mb-3">Items</p>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <p>
                            {item.quantity}x {item.name}
                          </p>
                          <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                      <p className="font-semibold">Total</p>
                      <p className="font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {order.status === 'processing' && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">Your order is being prepared and will be delivered soon.</p>
                    </div>
                  )}
                  
                  {order.status === 'pending' && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">Your order has been received and is waiting to be processed.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
};

export default Orders;
