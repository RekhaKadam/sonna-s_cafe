import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

interface OrderConfirmationProps {
  orderData?: {
    name: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
  };
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderData = {
    name: 'Guest',
    orderId: 'ORD000000',
    amount: 0,
    paymentMethod: 'COD'
  },
  onContinueShopping
}) => {
  const { clearCart } = useCart();
  
  // Clear cart on confirmation page load
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="container mx-auto mt-10 p-6 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 flex justify-center">
          {/* Success Icon */}
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order, {orderData.name}. We've received your order and it's being prepared.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold">{orderData.orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">₹{orderData.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold">{orderData.paymentMethod}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          We'll send you a confirmation SMS with your order details.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={onContinueShopping}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue ordering
          </button>
          
          <button 
            onClick={() => onContinueShopping()}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
