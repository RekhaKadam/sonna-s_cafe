import React, { useState } from 'react';
import OTPModal from './OTPModal';
import { useCart } from '../contexts/CartContext';

interface PaymentProps {
  customerData: {
    fullName: string;
    mobileNumber: string;
  };
  onPaymentComplete: (orderData: {
    name: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
  }) => void;
}

const Payment: React.FC<PaymentProps> = ({ customerData, onPaymentComplete }) => {
  const { getTotalPrice } = useCart();
  
  // Get user details from props
  const { fullName, mobileNumber } = customerData || { 
    fullName: 'Guest', 
    mobileNumber: '0000000000' 
  };
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  
  // Calculate total amount with taxes
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1; // 10% tax
  const totalAmount = subtotal + tax;

  const handlePaymentClick = () => {
    // In a real app, you would call your backend to send an OTP
    console.log(`Sending OTP to ${mobileNumber} for payment verification`);
    setIsOtpModalOpen(true);
  };

  const handleOtpSuccess = () => {
    // On successful OTP verification:
    // 1. Close the modal
    setIsOtpModalOpen(false);
    
    // 2. Process the payment/order (would be an API call in a real app)
    console.log('OTP verified. Processing payment and creating order...');
    
    // 3. Complete the payment and move to order confirmation
    onPaymentComplete({ 
      name: fullName,
      orderId: `ORD${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      amount: totalAmount,
      paymentMethod
    });
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>
      
      {/* Customer Info Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Information</h2>
        <p className="text-gray-700">
          Ordering for: <span className="font-semibold">{fullName}</span> 
          <span className="text-gray-500 ml-2">(+91 {mobileNumber})</span>
        </p>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-2">
            <span>Total:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Method Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        
        <div className="space-y-4 mb-6">
          {/* Cash on Delivery Option */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer flex items-center space-x-3 ${
              paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('COD')}
          >
            <div className={`w-5 h-5 rounded-full border ${
              paymentMethod === 'COD' ? 'border-indigo-600' : 'border-gray-400'
            } flex items-center justify-center`}>
              {paymentMethod === 'COD' && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
            </div>
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when your order arrives</p>
            </div>
          </div>
          
          {/* UPI Payment Option */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer flex items-center space-x-3 ${
              paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('UPI')}
          >
            <div className={`w-5 h-5 rounded-full border ${
              paymentMethod === 'UPI' ? 'border-indigo-600' : 'border-gray-400'
            } flex items-center justify-center`}>
              {paymentMethod === 'UPI' && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
            </div>
            <div>
              <p className="font-medium">UPI / QR Code</p>
              <p className="text-sm text-gray-500">Pay directly from your bank account</p>
            </div>
          </div>
        </div>
        
        {/* Pay Button */}
        <button
          onClick={handlePaymentClick}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {paymentMethod === 'COD' ? 'Confirm Order' : `Pay ₹${totalAmount.toFixed(2)}`}
        </button>
      </div>
      
      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSuccess={handleOtpSuccess}
        mobileNumber={mobileNumber}
      />
    </div>
  );
};

export default Payment;
