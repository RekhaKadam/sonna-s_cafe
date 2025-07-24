import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface CheckoutProps {
  onProceedToPayment: (data: { fullName: string; mobileNumber: string }) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onProceedToPayment }) => {
  const { cartItems, getTotalPrice } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    mobileNumber: '',
  });
  
  // Calculate total amount - tax will be shown only at payment
  const subtotal = getTotalPrice();
  const totalAmount = subtotal; // No tax display in checkout
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  const validateForm = () => {
    const errors = {
      fullName: '',
      mobileNumber: '',
    };
    let isValid = true;
    
    // Validate full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }
    
    // Validate mobile number (must be 10 digits)
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleProceedToPayment = () => {
    if (validateForm()) {
      // Send data to parent component
      onProceedToPayment({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber
      });
    }
  };
  
  // If cart is empty, show message and button to go back to menu
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-10 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <button 
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
        >
          Browse Menu
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto mt-10 p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Details Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                )}
              </div>
              
              {/* Mobile Number Input */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {formErrors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.mobileNumber}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  We'll send an OTP to verify this number during payment
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Order Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Proceed Button */}
            <button
              onClick={handleProceedToPayment}
              className="w-full mt-6 py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
