import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, User, MapPin, CreditCard, Check, Gift } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Addons from './Addons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  openInCheckoutMode?: boolean;
  isLoggedIn: boolean;
  setActiveSection: (section: string) => void;
  currentUser: { name: string; phone: string } | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentUser: (user: { name: string; phone: string } | null) => void;
}

interface CheckoutForm {
  name: string;
  phone: string;
  deliveryMethod: 'dine-in' | 'pickup' | 'delivery';
  paymentMethod: 'upi' | 'cod' | '';
  address?: string;
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  openInCheckoutMode = false, 
  isLoggedIn, 
  setActiveSection, 
  currentUser,
  setIsLoggedIn,
  setCurrentUser
}) => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalLoyaltyPoints } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    deliveryMethod: 'dine-in',
    paymentMethod: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [orderSummary, setOrderSummary] = useState<{total: number; loyaltyPoints: number} | null>(null);

  // Effect to pre-fill form with logged-in user's data
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        phone: currentUser.phone
      }));
    }
  }, [isLoggedIn, currentUser, showCheckout]); // Re-run when checkout opens

  // Effect to handle opening in checkout mode
  useEffect(() => {
    if (openInCheckoutMode && isOpen) {
      setShowCheckout(true);
    } else if (!isOpen) {
      setShowCheckout(false);
      setShowPayment(false);
      setShowOtpVerification(false);
      setShowOrderSuccess(false);
      setOrderSummary(null);
    }
  }, [isOpen, openInCheckoutMode]);

  // Handle back button behavior for cart
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isOpen) {
        if (showOtpVerification) {
          // If in OTP verification, go back to payment view
          event.preventDefault();
          setShowOtpVerification(false);
          window.history.pushState(null, '', window.location.href);
        } else if (showPayment) {
          // If in payment view, go back to checkout view
          event.preventDefault();
          setShowPayment(false);
          window.history.pushState(null, '', window.location.href);
        } else if (showCheckout) {
          // If in checkout mode, go back to cart view
          event.preventDefault();
          setShowCheckout(false);
          window.history.pushState(null, '', window.location.href);
        } else {
          // Otherwise close the cart
          event.preventDefault();
          onClose();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };
    
    // Add a history entry when cart opens or checkout mode changes
    if (isOpen) {
      window.history.pushState(null, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, showCheckout, onClose]);

  // Add focus effect for OTP input
  useEffect(() => {
    if (showOtpVerification) {
      const otpInput = document.getElementById('otp-input');
      if (otpInput) {
        otpInput.focus();
      }
    }
  }, [showOtpVerification]);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.deliveryMethod === 'delivery' && !formData.address?.trim()) {
      errors.address = 'Address is required for delivery';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Skip login check and go directly to checkout
    setShowCheckout(true);
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) {
      return;
    }
    
    // Store customer details in localStorage to simulate session
    try {
      localStorage.setItem('customerDetails', JSON.stringify({
        name: formData.name,
        phone: formData.phone
      }));
    } catch (err) {
      console.error('Could not save customer details:', err);
    }
    
    // Proceed to payment screen
    setShowPayment(true);
  };

  const handlePaymentSelection = (method: 'upi' | 'cod') => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
    
    // Clear any previous error
    if (formErrors.paymentMethod) {
      setFormErrors(prev => ({ ...prev, paymentMethod: '' }));
    }
  };

  const getDeliveryFee = () => {
    return formData.deliveryMethod === 'delivery' ? 50 : 0;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSendOtp = () => {
    if (!formData.paymentMethod) {
      setFormErrors(prev => ({ ...prev, paymentMethod: 'Please select a payment method' }));
      return;
    }

    // Save order summary before clearing cart
    setOrderSummary({
      total: getFinalTotal(),
      loyaltyPoints: getTotalLoyaltyPoints()
    });

    // If user is already logged in, skip OTP verification
    if (isLoggedIn && currentUser) {
      // Directly process the order without OTP
      const orderDetails = {
        id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString().split('T')[0],
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getFinalTotal(),
        status: 'processing',
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        loyaltyPoints: getTotalLoyaltyPoints()
      };
      
      // Store order in localStorage
      try {
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = [orderDetails, ...existingOrders];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        // Update user profile with loyalty points
        const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        localStorage.setItem('userProfile', JSON.stringify({
          ...existingProfile,
          name: formData.name,
          phone: formData.phone,
          loyaltyPoints: (existingProfile.loyaltyPoints || 0) + getTotalLoyaltyPoints(),
          orders: updatedOrders.length
        }));
      } catch (err) {
        console.error('Could not save order details:', err);
      }
      
      // Complete the order
      setTimeout(() => {
        setShowOrderSuccess(true);
        clearCart();
        
        // Reset states
        setShowPayment(false);
      }, 500);
      
      return;
    }

    // For non-logged-in users, proceed with OTP verification
    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    
    // In a real app, you would send this OTP to the user's phone
    console.log(`OTP sent to ${formData.phone}: ${otpCode}`);
    
    // Show OTP verification alert for non-logged-in users
    alert(`OTP sent to ${formData.phone}: ${otpCode}`);
    
    // Instead of alert, we'll show the OTP in the verification screen
    setShowOtpVerification(true);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      // Save order summary before clearing cart
      setOrderSummary({
        total: getFinalTotal(),
        loyaltyPoints: getTotalLoyaltyPoints()
      });

      // Login the user
      setIsLoggedIn(true);
      setCurrentUser({
        name: formData.name,
        phone: formData.phone
      });
      
      // Create order details
      const orderDetails = {
        id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString().split('T')[0],
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getFinalTotal(),
        status: 'processing',
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        loyaltyPoints: getTotalLoyaltyPoints()
      };
      
      // Store order in localStorage
      try {
        // Get existing orders or initialize empty array
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = [orderDetails, ...existingOrders];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        // Store user profile with loyalty points
        localStorage.setItem('userProfile', JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          loyaltyPoints: getTotalLoyaltyPoints(),
          orders: updatedOrders.length
        }));
      } catch (err) {
        console.error('Could not save order details:', err);
      }
      
      // Complete the order
      setTimeout(() => {
        setShowOrderSuccess(true);
        clearCart();
        
        // Reset states
        setOtp('');
        setGeneratedOtp('');
        setShowOtpVerification(false);
        setShowPayment(false);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          deliveryMethod: 'dine-in',
          paymentMethod: '',
          address: ''
        });
      }, 1000);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  if (!isOpen) return null;

  if (showOrderSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-in">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-display">Order Placed!</h2>
            <p className="text-gray-600 mb-2">
              Your order has been successfully placed. You will receive a confirmation on WhatsApp shortly.
            </p>
            <p className="text-sm text-amber-600 font-medium mb-4">
              You are now logged in to your account!
            </p>
            
            <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Order Total:</span>
                <span className="font-bold text-amber-600">₹{orderSummary?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Loyalty Points Earned:</span>
                <span className="font-bold text-amber-600">{orderSummary?.loyaltyPoints || 0} pts</span>
              </div>
            </div>
            
            <div className="flex w-full space-x-3">
              <button
                onClick={() => {
                  setShowOrderSuccess(false);
                  setOrderSummary(null);
                  onClose();
                  setActiveSection('orders');
                }}
                className="flex-1 py-3 bg-amber-50 text-amber-700 rounded-lg font-semibold hover:bg-amber-100 transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={() => {
                  setShowOrderSuccess(false);
                  setOrderSummary(null);
                  onClose();
                  setActiveSection('home');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-bold shadow-md transform transition-all duration-300 hover:scale-105"
              >
                Continue Ordering
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div 
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold font-display flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            {showOtpVerification ? 'Verify OTP' : 
             showPayment ? 'Payment' : 
             showCheckout ? 'Checkout' : 
             'Your Cart'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Content or Checkout Form */}
        <div className="flex-1 overflow-y-auto h-full pb-32">
          {showOtpVerification ? (
            /* OTP Verification Screen */
            <div className="p-6 space-y-6">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Verify Phone Number</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the OTP sent to <span className="font-semibold">{formData.phone}</span>
                </p>
                
                {/* OTP Display Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-center">
                  <p className="text-xs text-blue-600 mb-1">For demo purposes, use this OTP:</p>
                  <p className="text-xl font-bold tracking-widest text-blue-700">{generatedOtp}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-3 text-center text-lg font-bold tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border-gray-300"
                      placeholder="••••••"
                    />
                  </div>
                  
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-bold shadow-md transform transition-all duration-300 hover:scale-105"
                  >
                    Verify & Complete Payment
                  </button>
                  
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Didn't receive the OTP? <button 
                      className="text-amber-600 font-medium" 
                      onClick={() => {
                        // Generate new OTP
                        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(newOtp);
                      }}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Paying with: <span className="font-semibold">
                    {formData.paymentMethod === 'upi' ? 'UPI / Online Payment' : 'Cash on Delivery'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Amount: <span className="font-semibold text-amber-600">₹{getFinalTotal()}</span>
                </p>
              </div>
            </div>
          ) : showPayment ? (
            /* Payment Screen */
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 font-display">Select Payment Method</h3>
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm font-medium text-gray-600 mb-2">Order Summary</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-bold">₹{getTotalPrice()}</span>
                </div>
                {getDeliveryFee() > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivery Fee:</span>
                    <span className="font-bold">₹{getDeliveryFee()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-amber-600">₹{getFinalTotal()}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                  How would you like to pay?
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'upi', label: 'UPI / Online Payment', desc: 'Pay via Google Pay, PhonePe, etc.' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => handlePaymentSelection(method.value as 'upi' | 'cod')}
                      className={`w-full p-3 rounded-lg border flex items-start transition-all ${
                        formData.paymentMethod === method.value
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="w-5 h-5 mt-0.5 mr-3 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ease-in-out">
                        {formData.paymentMethod === method.value && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{method.label}</span>
                        <span className="text-xs text-gray-500">{method.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {formErrors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{formErrors.paymentMethod}</p>
                )}
              </div>
              
              {/* User Authentication Notice */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h5 className="text-sm font-medium text-blue-700">Login with OTP</h5>
                    <p className="text-xs text-blue-600 mt-1">
                      When you proceed to pay, we'll send a one-time password (OTP) to your phone for quick login and payment verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : showCheckout ? (
            /* Checkout Form */
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 font-display">Order Summary</h3>
              
              {/* Order Items Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name} x {item.quantity}</span>
                    <span className="text-sm font-bold text-amber-600">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{getTotalPrice()}</span>
                  </div>
                  {getDeliveryFee() > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Delivery Fee:</span>
                      <span className="font-bold">₹{getDeliveryFee()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Gift className="h-3 w-3 text-amber-500" />
                      <span className="text-sm">Loyalty Points:</span>
                    </div>
                    <span className="text-sm font-bold text-amber-600">{getTotalLoyaltyPoints()} pts</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-amber-600">₹{getFinalTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2 text-amber-600" />
                  Customer Details
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your WhatsApp number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                  Delivery Method
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'dine-in', label: 'Dine-In', desc: 'Eat at restaurant' },
                    { value: 'pickup', label: 'Pickup', desc: 'Collect yourself' },
                    { value: 'delivery', label: 'Delivery', desc: '₹50 delivery fee' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => handleInputChange('deliveryMethod', method.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all text-center ${
                        formData.deliveryMethod === method.value
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="font-semibold">{method.label}</div>
                      <div className="text-xs text-gray-500">{method.desc}</div>
                    </button>
                  ))}
                </div>
                
                {/* Address Field (only for delivery) */}
                {formData.deliveryMethod === 'delivery' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Enter your complete delivery address"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ShoppingCart className="h-16 w-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p>Add some delicious items to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center space-x-4">
                        {/* Item Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 font-display truncate">{item.name}</h3>
                          <p className="text-amber-600 font-bold">₹{item.price}</p>
                          {item.loyaltyPoints && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Gift className="h-3 w-3 text-amber-500" />
                              <span className="text-xs text-amber-600 font-medium">
                                {item.loyaltyPoints} pts
                              </span>
                            </div>
                          )}
                          
                          {/* Show addons (read-only) */}
                          {/* Addons now managed globally at the end */}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Global Addons Section - Shown only once */}
                  {items.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-gray-800 mb-3">Add Extras to Your Order</h3>
                      <Addons />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-bold text-gray-800 font-display">Total:</span>
              <span className="text-xl font-bold text-amber-600">₹{getFinalTotal()}</span>
            </div>
            
            {/* Loyalty Points Display */}
            <div className="flex justify-between items-center mb-3 py-1.5 bg-amber-50 rounded-lg px-2">
              <div className="flex items-center space-x-1.5">
                <Gift className="h-3 w-3 text-amber-500" />
                <span className="text-xs font-medium text-amber-700">Loyalty Points Earned:</span>
              </div>
              <span className="text-xs font-bold text-amber-600">{getTotalLoyaltyPoints()} pts</span>
            </div>
            
            {showOtpVerification ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOtpVerification(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Payment
                </button>
              </div>
            ) : showPayment ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Checkout
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={!formData.paymentMethod}
                  className={`flex-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                    !formData.paymentMethod 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transform hover:scale-105'
                  }`}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Pay Now & Verify
                </button>
              </div>
            ) : showCheckout ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transform hover:scale-105"
                >
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="flex-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transform hover:scale-105"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
